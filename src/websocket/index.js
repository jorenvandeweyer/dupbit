const WebSocket = require('ws');
const Token = require("../util/Token");

// const wss = new WebSocket.Server({ server });
//
// wss.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });
//
//   ws.send('something');
// });

let wss;

function verifyClient(info, callback) {
    const token = info.req.headers.token;

    if (!token) {
        callback(false, 401, "Provide a token please.");
    } else {
        let clientInfo = Token.verifyToken(token);

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
