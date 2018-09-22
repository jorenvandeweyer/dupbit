const Token = require("../../src/util/Token");
const ws = require("../../src/websocket/index");

module.exports = async (req, res) => {
    const connection = ws.findConnection(req.auth.id, req.auth.tid);
    if (connection) connection.close();

    await Token.removeToken(req.auth.tid);

    res.clearCookie("sid", {
        // secure: true
    });

    res.redirect("back");
};
