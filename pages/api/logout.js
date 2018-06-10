const Token = require("../../src/util/Token");
const Cookie = require("../../src/util/Cookie");
const WebSocket = require("../../src/websocket/index");

async function resolve(data, apidata) {
    await Token.removeToken(apidata.session.tid);

    const connection = WebSocket.findConnection(apidata.session.id, apidata.session.tid);
    if (connection) connection.close();

    return {
        success: true,
        login: false,
        backdirect: true,
        cookie: Cookie.remove("sid"),
    };
}

module.exports = {
    resolve
};
