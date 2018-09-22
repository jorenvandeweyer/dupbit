const Token = require("../../src/util/Token");
const ws = require("../../src/websocket/index");

module.exports = async (req, res) => {
    const connection = ws.findConnection(req.auth.tid, req.auth.id));
    if (connection) connection.close();

    await Token.removeToken(req.auth.tid);

    res.clearCookie("sid", {
        // secure: true
    });

    res.redirect("back");
};
