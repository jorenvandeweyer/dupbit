const ws = require("../websocket/index");
const db = require("./Database");

module.exports = async (tid, uid) => {
    const conn = ws.findConnection(uid, tid);
    if (conn) conn.close();
    await db.removeToken(tid);
}
