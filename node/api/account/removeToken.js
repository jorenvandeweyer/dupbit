const db = require("../../src/util/Database");
const Token = require("../../src/util/Token");
const ws = require("../../src/websocket/index");

module.exports = async (req, res) => {
    const data = req.query;
    if (req.auth.isLoggedIn && data.tid) {
        const result = await db.getToken({tid: data.tid});
        if (result.length) {
            const token = result[0];
            if (token.uid === req.auth.id) {
                const connection = ws.findConnection(token.uid, token.id);
                console.log(connection);
                if (connection) connection.close();

                await Token.removeToken(token.id);

                return res.json({
                    success: true
                });
            }
        }
        res.json({
            success: false,
            reason: "not a token",
        });
    } else {
        res.json({
            success: false,
            reason: "invalid params",
        });
    }
};
