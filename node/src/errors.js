const db = require("../src/util/Database");

module.exports = async (req, res, next) => {
    res.errors = {
        incomplete: () => {
            res.status(400).json({
                success: false,
                reason: "missing params",
            });
        },
        invalid: () => {
            res.status(400).json({
                success: false,
                reason: "invalid params",
            });
        },
        custom: (reason="custom") => {
            res.status(400).json({
                success: false,
                reason,
            });
        },
        wrongCredentials: (logTry=false) => {
            if (logTry) addLoginAttempt(req, false);
            
            res.status(401).json({
                success: false,
                reason: "Wrong credentials",
            });
        },
        verifyEmail: () => {
            res.status(401).json({
                success: false,
                reason: "Verify email first",
            });
        },
        needAuth: () => {
            res.status(401).json({
                success: false,
                reason: "Need to be authenticated",
            });
        },

    };
    next();
};

function addLoginAttempt(req, success) {
    const ip = req.get("x-real-ip");
    const username = req.body.username;

    return db.addLoginAttempt(username, success, ip);
}
