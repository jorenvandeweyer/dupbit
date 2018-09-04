const WebSocket = require("ws");
const Token = require("../util/Token");
const Cookie = require("../util/Cookie");

let wss;
const Clients = new Map([[0, new Map()]]);

async function verifyClient(info, callback) {
    let token;
    if (info.req.headers.authentication) {
        token = info.req.headers.authentication;
    } else if (info.req.headers.token) {
        token = info.req.headers.token;
    } else {
        const cookies = Cookie.parse(info.req.headers.cookie);
        if ("sid" in cookies) {
            token = cookies.sid;
        }
    }

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
        ws.identifier = req.headers.identifier || "unkown";
        ws.owner = req.user;

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
        // console.log("websocket action not specified");
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
