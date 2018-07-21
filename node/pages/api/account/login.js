const Database = require("../../../src/util/Database");
const Token = require("../../../src/util/Token");

module.exports = async (req, res) => {
    const data = req.body;
    if (data.username && data.password) {
        const login = await Database.verifyLogin(data.username, data.password);

        if (login) {
            Database.addLoginAttempt(data.username, true, req.ip);
            const id = await Database.getIDByUsername(data.username);
            const level = await Database.getLevelByID(id);

            if (level < 1) {
                if (data.remote) {
                    res.status(404).json({
                        success: false,
                        reason: "email not verified"
                    });
                } else {
                    if (data.redirect) {
                        res.redirect(`login?redirect=${data.redirect}&notActivated`);
                    } else {
                        res.redirect("login?notActivated");
                    }
                }
            } else {
                const expires = data.expires ? parseInt(data.expires) : 365*10*24*60*60;
                if (!data.remote) data.remote = "website";

                const token = await Token.createToken({
                    isLoggedIn: true,
                    id,
                }, expires, {
                    remote: data.remote,
                    name: getInfo(req, data),
                    ip: req.ip,
                });
                res.cookie("sid", token, {
                    maxAge: expires*1000,
                    // secure: true,
                });
                res.set("Access-Control-Allow-Credentials", "true");
                res.set("Access-Control-Allow-Origin", req.get("origin") ? req.get("origin") : "*");

                if (data.remote === "website") {
                    if (data.redirect) {
                        if (data.redirect === "/index") data.redirect = "/welcome";
                        res.redirect(data.redirect);
                    } else {
                        res.redirect("/welcome");
                    }
                } else {
                    res.json({
                        success: true,
                        login: true,
                        id,
                        token,
                    });
                }
            }

        } else {
            Database.addLoginAttempt(data.username, false, req.ip);

            if (data.remote) {
                res.json({
                    success: false,
                });
            } else {
                if (data.redirect) {
                    res.redirect(`/login?redirect=${data.redirect}&fail`);
                } else {
                    res.redirect("/login?fail");
                }
            }
        }

    } else {
        res.status(404).json({
            success: false,
            reason: "missing parameters"
        });
    }
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
