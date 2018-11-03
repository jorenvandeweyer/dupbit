const db = require("../../src/util/Database");
const verifyUser = require("../../src/util/verifyUser");
const bcrypt = require("bcrypt");
const Mail = require("../../src/util/Mail");

module.exports = async (req, res) => {
    const data = req.body;

    if (!req.auth.isLoggedIn) return res.errors.needAuth();

    if (!data.oldpassword || !data.newpassword || !data.newpasswordconfirm)
        return res.errors.incomplete();
    
    const hash = await db.getPasswordByID(req.auth.uid);
    const match = await bcrypt.compare(data.oldpassword, hash);
    if (!match) return res.errors.wrongCredentials();

    const errorCode = verifyUser.verifyPassword(data.newpassword);
    const errorCodeConfirm = verifyUser.verifyPasswordMatch(data.newpassword, data.newpasswordconfirm);
    
    if (errorCode !== 0 || errorCodeConfirm !== 0) {
        return res.status(400).json({
            success: false,
            password: verifyUser.decodeErrorCode(errorCode),
            confirmpassword: verifyUser.decodeErrorCode(errorCodeConfirm),
        });
    }

    const newhash = await bcrypt.hash(data.newpassword, 10);
    db.setPassword(req.auth.uid, newhash);

    res.json({
        success: true,
    });

    const email = await db.getEmailByID(req.auth.uid);

    await Mail.sendTemplate({
        subject: `Security update: password change for ${req.auth.username}`,
        sender: "noreply@dupbit.com",
        receiver: email,
        title: `Security update: password change for ${req.auth.username}`,
        message_title: `Security update: password change for ${req.auth.username}`,
        message_content: `Your password got changed at ${new Date().toString()}. If this was not you please change your password with the password recovery option`,
        button_title: "This was not me",
        button_url: `https://dupbit.com/account/edit`,
    });
}
