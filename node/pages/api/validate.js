const Database = require("../../src/util/Database");
const Token = require("../../src/util/Token");
const Cookie = require("../../src/util/Cookie");
const IP = require("../../src/util/IP");
const bcrypt = require("bcrypt");
const { getInfo } = require("./login");

async function resolve(data, apidata) {
    if (data.id && data.hash) {
        let id = data.id;
        let hash = data.hash;

        let passwordHash = await Database.getPasswordByID(id);
        let notActivated = await Database.getLevelByID(id) === 0;

        if (passwordHash && bcrypt.compareSync(passwordHash, hash.replace("$2y$", "$2a$")) && notActivated) {
            await Database.setLevel(id, 1);
            let ip = IP.extract(apidata.request);
            await Database.addLoginAttemptByID(id, true, ip);

            let username = await Database.getUsernameByID(id);
            let level = await Database.getLevelByID(id);

            let token = await Token.createToken({
                isLoggedIn: true,
                id: id,
                username: username,
                level: level,
            },365*10*24*60*60 ,{
                remote: "website",
                name: getInfo(apidata, data),
                ip,
            });
            let cookie = Cookie.create("sid", token);
            if ("redirect" in data) {
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
        } else {
            return {
                success: false,
                redirect: "not_authorized",
                status: 303, //should be 401 but not showing custom page then
            };
        }
    } else {
        return {
            success: false,
            redirect: "not_authorized",
            status: 303, //should be 401 but not showing custom page then
        };
    }
}

module.exports = {
    resolve
};
