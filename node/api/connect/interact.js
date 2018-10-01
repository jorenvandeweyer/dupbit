const ws = require("../../src/websocket/index");
const db = require("../../src/util/Database");

module.exports = async (req, res) => {
    const data = req.body;
    if (req.auth.isLoggedIn && data.tid) {
        const uid = req.auth.uid;
        const token = await getToken(uid, data.tid);

        if (token) {
            const socket = await ws.findConnection(uid, token.tid);
            if (socket) {
                socket.send(JSON.stringify({
                    action: {
                        name: data.name,
                        tabId: data.tabId,
                        data: {
                            action: data.action,
                            value: data.value,
                        },
                    },
                }));
                const result = await waitForResponse(socket, data.name);
                res.json(result);
            }
        } else {
            res.status(401).json({
                success: false,
                reason: "Not a token",
            });
        }
    } else {
        res.status(404).json({
            success: false,
            reason: "need to be authenticated and using a proper tid",
        });
    }
};

async function getToken(uid, tid) {
    let tokens = await db.getToken({ uid });
    const token = tokens.filter(token => token.id === parseInt(tid));
    return token.length ? token[0] : null;
}

async function waitForResponse(socket, action) {
    return new Promise((resolve) => {
        socket.addEventListener("message", function listener(message) {
            console.log(message.data);
            message = JSON.parse(message.data);
            if (message.action === action) {
                resolve(message);
                socket.removeEventListener("message", listener);
            }
        });
    });
}
