const Database = require("../../../src/util/Database");
const Token = require("../../../src/util/Token");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
    const data = req.query;

    if (data.id && data.hash) {
        const id = data.id;
        const hash = data.hash;

        const passwordHash = await Database.getPasswordByID(id);
        const notActivated = await Database.getLevelByID(id) === 0;

        if (passwordHash && bcrypt.compareSync(passwordHash, hash) && notActivated) {
            await Database.setLevel(id, 1);
            await Database.addLoginAttempt(id, true, req.ip);

            const token = await Token.createToken({
                isLoggedIn: true,
                id,
            }, 365*10*24*60*60, {
                remote: "website",
                name: getInfo(req, data),
                ip: req.ip
            });

            res.cookie("sid", token, {
                maxAge: 365*10*24*60*60*1000,
                // secure: true,
            });
            res.redirect("/welcome");
        }
    }
    res.redirect(303, "/notauthorized");
};

function getInfo(req, data) {
    if (data.ua_overwrite) {
        return JSON.stringify({
            os: data.ua_os ? data.ua_os : "Other",
            name: data.ua_name ? data.ua_name : "Other",
        });
    }
    let object = {
        family: req.ua_os.device.family,
        os: req.ua_os.os.toString(),
        ua: req.ua_os.ua.toString(),
    };
    if (object.os === "Other" && object.ua === "Other" && object.family === "Other") {
        object = {
            ua: req.ua_os.string,
        };
    }
    return JSON.stringify(object);
}
