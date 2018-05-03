const WebSocket = require("ws");
const Token = require("../util/Token");

let wss;
const Clients = new Map();

async function verifyClient(info, callback) {
    const token = info.req.headers.token;

    if (!token) {
        callback(false, 401, "Provide a token please.");
    } else {
        let clientInfo = await Token.verifyToken(token);

        if (!clientInfo) {
            callback(false, 401, "Tokin invalid.");
        } else {
            info.req.user = clientInfo.data;
            callback(true);
        }
    }
}

function create(server) {
    wss = new WebSocket.Server({
        server,
        verifyClient,
    });

    wss.on("connection", (ws, req) => {
        addWS(ws, req);
        ws.on("message", (message) => {
            console.log(`RECIEVED: ${message}`);
        });

        ws.send(JSON.stringify({
            message: "YOU ARE CONNECTED"
        }));

        ws.on("close", () => {
            Clients.get(req.user.id).delete(req.user.tid);
            console.log("CLOSED");
        });
    });
}

function addWS(ws, req) {
    const user = req.user;
    if (!Clients.has(user.id)) {
        Clients.set(user.id, new Map());
    }
    Clients.get(user.id).set(user.tid, ws);
}

function findConnection(uid, tid) {
    if (Clients.has(uid)) {
        if (Clients.get(uid).has(tid)) {
            return Clients.get(uid).get(tid);
        }
    }
    return false;
}

module.exports = {
    create,
    findConnection,
};
