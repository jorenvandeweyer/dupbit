const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../src/util/Database");
const Mail = require("../../src/util/Mail");
const verifyUser = require("../../src/util/verifyUser");
const { privateKey, publicKey } = require("../../src/util/Token");

module.exports = express.Router()
// .all("*", (req, res, next) => {
//     next();
// })
    .get("*", async (req, res) => {
        const data = req.query;

        if (!data.token) return res.errors.incomplete();

        const result = await validateToken(data.token);
        if (result) {
            return res.json({
                success: true,
                ...result,
            });
        } else {
            return res.json({
                success: false,
                reason: "Token expired",
                expired: true,
            });
        }
    })
    .post("*", async (req, res) => {
        const data = req.body;
        
        if (!data.email) return res.errors.incomplete();

        const id = await db.getIdByEmail(data.email);

        if (id) {
            const email = await db.getEmailByID(id);
            const username = await db.getUsernameByID(id);
            const password = await db.getPasswordByID(id);
            const hash = await bcrypt.hash(password, 10);

            const token = jwt.sign({
                id,
                hash,
                exp: Math.floor(Date.now() / 1000) + 60*60,
            }, privateKey, {algorithm: "RS256"});

            await Mail.sendTemplate({
                subject: `Dupbit | Password recovery`,
                sender: "noreply@dupbit.com",
                receiver: email,
                title: `Password recovery for ${username}`,
                message_title: `Password recovery for ${username}`,
                message_content: `Click the button below to change your password. This mail will expire in 60 minutes.<br><br>If you didn't requested a password recovery you can ignore and delete this mail.`,
                button_title: "Change password",
                button_url: `https://dupbit.com/account/recovery?token=${token}`,
            });
        }

        res.json({
            success: true,
            message: "If there was an account found for this email there was a password recovery mail sent.",
        });
    })
    .put("*", async (req, res) => {
        const data = req.body;
        
        if (!data.token || !data.password || !data.password_confirm)
            return res.errors.incomplete();

        const result = await validateToken(data.token);
        if (!result) return res.json({
            success: false,
            reason: "Token expired",
            expired: true,
        });

        const errorCode = verifyUser.verifyPassword(data.password);
        const errorCodeConfirm = verifyUser.verifyPasswordMatch(data.password, data.password_confirm);
        
        if (errorCode !== 0 || errorCodeConfirm !== 0) {
            return res.json({
                success: false,
                password: verifyUser.decodeErrorCode(errorCode),
                confirmpassword: verifyUser.decodeErrorCode(errorCodeConfirm),
            });
        }

        const newhash = await bcrypt.hash(data.password, 10);
        const destroySessionHash = await bcrypt.hash(newhash, 10);

        await db.setPassword(result.id, newhash);

        const email = await db.getEmailByID(result.id);

        await Mail.sendTemplate({
            subject: `Dupbit | Security update: password change for ${result.username}`,
            sender: "noreply@dupbit.com",
            receiver: email,
            title: `Security update: password change for ${result.username}`,
            message_title: `Security update: password change for ${result.username}`,
            message_content: `Your password got changed at ${new Date().toString()}. If this was not you please change your password with the password recovery option`,
            button_title: "This was not me",
            button_url: `https://dupbit.com/account/edit`,
        });

        res.json({
            success: true,
            hash: destroySessionHash,
            ...result,
        });
        //CHANGE PASSWORD CHECK IF TOKEN VALID AND PASSWORDS OKE
    })
    .delete("*", async (req, res) => {
        //none
    });

async function validateToken(token) {
    try {
        const decoded = jwt.verify(token, publicKey, {algorithm: "RZ256"});
        const id = decoded.id;
        const password = await db.getPasswordByID(id);
        
        const match = await bcrypt.compare(password, decoded.hash);
        if (!match) return false;

        const username = await db.getUsernameByID(id);
        
        return {
            id,
            username,
        }
    } catch(e) {
        return false;
    }
}
