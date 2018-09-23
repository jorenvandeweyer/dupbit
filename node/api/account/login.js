const Database = require("../../src/util/Database");
const Token = require("../../src/util/Token");

module.exports = async (req, res) => {
    const data = req.body;
    const ip = req.get("x-real-ip");
    if (data.username && data.password) {
        const login = await Database.verifyLogin(data.username, data.password);

        if (login) {
            Database.addLoginAttempt(data.username, true, ip);
            const id = await Database.getIDByUsername(data.username);
            const level = await Database.getLevelByID(id);

            if (level < 1) {
                res.status(401).json({
                    success: false,
                    reason: "email not verified"
                });
            } else {
                const expires = data.expires ? parseInt(data.expires) : 365*10*24*60*60;
                if (!data.app_type) data.app_type = "unknown";

                const token = await Token.createToken({
                    uid: id,
                    info: data.info,
                    app_type: data.app_type,
                    ip,
                }, expires);
                res.cookie("sid", token, {
                    maxAge: expires*1000,
                    // secure: true,
                });
                res.set("Access-Control-Allow-Credentials", "true");
                res.set("Access-Control-Allow-Origin", req.get("origin") ? req.get("origin") : "*");

                res.json({
                    success: true,
                    login: true,
                    id,
                    token,
                });
            }

        } else {
            Database.addLoginAttempt(data.username, false, ip);

            res.status(401).json({
                success: false,
            });
        }

    } else {
        res.status(400).json({
            success: false,
            reason: "missing parameters"
        });
    }
};
