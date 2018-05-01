const db = require("../../src/util/Database");
const Token = require("../../src/util/Token");
const Cookie = require("../../src/util/Cookie");

async function resolve(data, apidata) {
    await db.removeToken(apidata.session.tid);
    return {
        success: true,
        login: false,
        backdirect: true,
        cookie: Cookie.remove("sid"),
    }
}

module.exports = {
    resolve
};
