const Database = require("../../src/util/Database");
const Token = require("../../src/util/Token");
const Cookie = require("../../src/util/Cookie");

async function resolve(data) {
    if (data.username && data.password) {
        let login = await Database.verifyLogin(data.username, data.password);

        if (login) {
            Database.addLoginAttempt(data.username, true);
            let id = await Database.getIDByUsername(data.username);
            let level = await Database.getLevelByID(id);

            if (level < 1) {
                if (data.redirect) {
                    data.redirect = `login?redirect=${data.redirect}&notActivated`;
                } else {
                    data.redirect = "login?notActivated"
                }
            } else {
                let token = Token.createToken({
                    isLoggedIn: true,
                    id: id,
                    username: data.username,
                    level: level,
                });
                let cookie = Cookie.create("sid", token);
                if (data.redirect) {
                    if (data.redirect === "index") {
                        data.redirect = "welcome";
                    }
                } else {
                    data.redirect = "welcome";
                }
                return {
                    success: true,
                    login: true,
                    id: id,
                    redirect: data.redirect,
                    cookie: cookie,
                };
            }


        } else {
            Database.addLoginAttempt(data.username, false);
            if (data.redirect) {
                data.redirect = `login?redirect=${data.redirect}&fail`;
            } else {
                data.redirect = "login?fail";
            }

            return {
                success: false,
                redirect: data.redirect
            };
        }
    }

    return {
        success: false
    };
}

module.exports = {
    resolve
};
