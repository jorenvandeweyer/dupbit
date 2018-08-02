const Token = require("../../src/util/Token");
const WebSocket = require("../../src/websocket/index");

module.exports = async (req, res) => {
    await Token.removeToken(req.auth.tid);

    const connection = WebSocket.findConnection(req.auth.id, req.auth.tid);
    if (connection) connection.close();

    res.clearCookie("sid", {
        // secure: true
    });

    res.redirect("back");
};
