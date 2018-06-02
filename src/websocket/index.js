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

    setInterval(ping, 30000);

    wss.on("connection", (ws, req) => {
        ws.isAlive = true;
        addWS(ws, req);
        ws.on("message", (message) => {
            handleMessage(ws, req, message);
        });

        ws.send(JSON.stringify({
            message: "YOU ARE CONNECTED"
        }));

        ws.on("close", () => {
            Clients.get(req.user.id).delete(req.user.tid);
            console.log("CLOSED");
        });

        ws.on("pong", heartbeat);
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

function getClient(uid) {
    if (Clients.has(uid)) {
        return Clients.get(uid);
    }
    return false;
}

function handleMessage(ws, req, message) {
    message = JSON.parse(message);

    if (message.action === "logout") {
        Token.removeToken(req.user.tid);
    } else if (message.action === "message") {
        console.log(message.content);
    } else {
        console.log("websocket action not specified");
        // console.log(message);
    }
}

function ping() {
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
}

function heartbeat() {
    this.isAlive = true;
}

module.exports = {
    create,
    findConnection,
    getClient,
};
