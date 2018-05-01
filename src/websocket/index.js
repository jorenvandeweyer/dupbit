const WebSocket = require('ws');
const Token = require("../util/Token");

let wss;

async function verifyClient(info, callback) {
    const token = info.req.headers.token;

    if (!token) {
        callback(false, 401, "Provide a token please.");
    } else {
        let clientInfo = await Token.verifyToken(token);

        if (!clientInfo) {
            callback(false, 401, "Tokin invalid.");
        } else {
            callback(true);
        }
    }
}

function create(server) {
    wss = new WebSocket.Server({
        server,
        verifyClient,
     });

    wss.on('connection', (ws) => {
        ws.on("message", (message) => {
            console.log(`RECIEVED: ${message}`);
        });

        ws.send("YOU ARE CONNECTED");

        ws.on("close", () => {
            console.log("CLOSED");
        })
    })
}

function findConnection() {
    return wss.getConnections();
}

module.exports = {
    create,
    findConnection,
};
