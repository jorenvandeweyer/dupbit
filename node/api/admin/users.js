const express = require("express");
const db = require("../../src/util/Database");

module.exports = express.Router()
    .all("*", (req, res, next) => {
        if (req.auth.isLoggedIn && req.auth.level >= 3) {
            next();
        } else {
            res.status(401).json({
                success: false,
                reason: "need to be authenticated",
            });
        }
    })
    .get("*", async (req, res) => {
        const users = await db.getUsers();
        res.json({
            success: true,
            users,
        });
    })
    .post("*", async (req, res) => {
        const data = req.body;

        if (data.id && data.username && data.email && data.level) {
            await db.setUsername(data.id, data.username);
            await db.addUsernameChange(data.id, data.username);
            await db.setEmail(data.id, data.email);
            await db.setLevel(data.id, data.level);
            res.json({
                success: true,
                data: {
                    username: data.username,
                    email: data.email,
                    level: data.level
                }
            });
        } else {
            res.status(405).json({
                success: false,
            });
        }
    })
    .put("*", async (req, res) => {
        res.status(405).json({
            success: false,
            reason: "use /api/account/register as end point",
        });
    })
    .delete("*", async (req, res) => {
        const data = req.body;

        if (data.id) {
            await db.unregister(data.id);
            res.json({
                success: true,
            });
        } else {
            res.status(405).json({
                success: false,
            });
        }
    });
