const db = require("../src/util/Database");

module.exports = async (req, res, next) => {
    res.errors = {
        incomplete: () => {
            res.status(400).json({
                success: false,
                reason: "missing params",
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

    };
    next();
};

function addLoginAttempt(req, success) {
    const ip = req.get("x-real-ip");
    const username = req.body.username;

    return db.addLoginAttempt(username, success, ip);
}
