const Database = require("../../src/util/Database");
const Token = require("../../src/util/Token");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
    const data = req.body;
    if (!data.username || !data.password) return res.errors.incomplete();

    const id = await resolveUsername(data.username);
    if (!id) return res.errors.wrongCredentials(true);

    const hash = await Database.getPasswordByID(id);
    const match = await bcrypt.compare(data.password, hash);
    if (!match) return res.errors.wrongCredentials(true);

    Database.addLoginAttempt(data.username, true, req.get("x-real-ip"));
    
    const level = await Database.getLevelByID(id);
    if (level < 1) res.errors.verifyEmail();

    const expires = data.expires ? parseInt(data.expires) : 365*10*24*60*60;
    if (!data.app_type) data.app_type = "unknown";

    const token = await Token.createToken({
        uid: id,
        info: data.info,
        app_type: data.app_type,
        ip: req.get("x-real-ip"),
    }, expires);

    res.cookie("sid", token, {
        maxAge: expires*1000,
        secure: true,
    });

    res.set("Access-Control-Allow-Credentials", "true");
    res.set("Access-Control-Allow-Origin", req.get("origin") ? req.get("origin") : "*");

    res.json({
        success: true,
        login: true,
        id,
        token,
    });
};

function resolveUsername(username) {
    if (username.includes("@")) {
        return Database.getIdByEmail(username);
    } else {
        return Database.getIDByUsername(username);
    }
}
