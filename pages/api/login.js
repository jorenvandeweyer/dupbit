const Database = require("../../src/util/Database");
const Token = require("../../src/util/Token");
const Cookie = require("../../src/util/Cookie");
const IP = require("../../src/util/IP");

async function resolve(data, apidata) {
    if (data.username && data.password) {
        let login = await Database.verifyLogin(data.username, data.password);
        let ip = IP.extract(apidata.request);
        if (login) {
            await Database.addLoginAttempt(data.username, true, ip);
            let id = await Database.getIDByUsername(data.username);
            let level = await Database.getLevelByID(id);

            if (level < 1) {
                if (data.redirect) {
                    data.redirect = `login?redirect=${data.redirect}&notActivated`;
                } else {
                    data.redirect = "login?notActivated"
                }
                return {
                    success: false,
                    redirect: data.remote ? false : data.redirect
                };
            } else {
                const expires = data.expires ? parseInt(data.expires) : 24*60*60;
                if (!data.remote) data.remote = "website";

                const token = await Token.createToken({
                    isLoggedIn: true,
                    id: id,
                    username: data.username,
                    level: level,
                }, expires, {
                    remote: data.remote,
                    name: getInfo(apidata),
                    ip,
                });
                const cookie = Cookie.create("sid", token, expires*1000);
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
                    id,
                    redirect: data.remote !== "website" ? false : data.redirect,
                    token,
                    cookie,
                    headers: {
                        "Access-Control-Allow-Origin": apidata.request.headers.origin ? apidata.request.headers.origin : "*",
                        "Access-Control-Allow-Credentials": "true",
                    },
                };
                // return await returnData(apidata, data, cookie);
            }


        } else {
            Database.addLoginAttempt(data.username, false, ip);
            if (data.redirect) {
                data.redirect = `login?redirect=${data.redirect}&fail`;
            } else {
                data.redirect = "login?fail";
            }

            return {
                success: false,
                redirect: data.remote ? false : data.redirect
            };
        }
    }

    return {
        success: false
    };
}

function getInfo(apidata) {
    let object = {
        family: apidata.request.ua_os.device.family,
        os: apidata.request.ua_os.os.toString(),
        ua: apidata.request.ua_os.ua.toString(),
    };
    if (object.os === "Other" && object.ua === "Other" && object.family === "Other") {
        object = {
            ua: apidata.request.ua_os.string,
        }
    }
    return JSON.stringify(object);
}

module.exports = {
    resolve
};
