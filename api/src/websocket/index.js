const WebSocket = require('ws');
const auth = require('../auth');
const uuidv1 = require('uuid').v1;

let wss;

class WebSocketServer {
    constructor(server) {
        this._server = server;
        this._wss = new WebSocket.Server({ noServer: true});

        this.clients = new Map([[0, new Map()]]);
        this.waiting = new Map();

        this._setup();
    }

    _setup() {
        this._wss.on('connection', (ws, req) => {
            console.log('CONNECTED', req.auth.uid, req.auth.jti);
            ws.isAlive = true;
            ws.auth = req.auth;
            ws.idtf = req.headers.identifier || 'unknown';

            this._addWS(ws, req);

            ws.sendR = sendR;

            ws.on('message', (message) => {
                this._handle(ws, req, message);
            });

            ws.on('close', () => {
                this._removeWS(ws, req);
            });

            ws.on('pong', function() {
                this.isAlive = true;
            });

            ws.send(JSON.stringify({
                system: true,
                msg: 'connected',
            }));
        });

        this._server.on('upgrade', (req, socket, head) => {
            auth(req, {cookie: () => null}, () => {
                if (!req.auth) return socket.destroy();

                this._wss.handleUpgrade(req, socket, head, (ws) => {
                    this._wss.emit('connection', ws, req);
                });
            });

        });

        setInterval(() => {this._ping();}, 30000);
    }

    _addWS(ws, req) {
        const user = req.auth;
        if (!this.clients.has(user.uid)) {
            this.clients.set(user.uid, new Map());
        }
        this.clients.get(user.uid).set(user.jti, ws);
    }

    _removeWS(_ws, req) {
        const user = req.auth;
        if (!this.clients.has(user.uid)) return;
        this.clients.get(user.uid).delete(user.jti);
    }

    _handle(ws, req, message) {
        try {
            message = {
                _raw: false,
                ...JSON.parse(message)
            };
        } catch (e) {
            message = {
                _raw: true,
                _value: message,
            };
        }

        if (message._raw) return console.log('raw socket message:', message._value);

        if (message._uuid) {
            if (this.waiting.has(message._uuid)) {
                const resolve = this.waiting.get(message._uuid);
                resolve(message);
                this.waiting.delete(message._uuid);
            }
        }

        if (message._system) console.log('to system', message.msg);
        if (message._ping)  ws.isAlive = true;
        if (message._logout) console.log('logout implement me pls');
    }

    _ping() {
        this._wss.clients.forEach((ws) => {
            if (!ws.isAlive) {
                console.log('terminated');
                return ws.terminate();
            }
            ws.isAlive = false;
            ws.send(JSON.stringify({
                action: 'ping',
            }));
            ws.ping(); // should I remove this?
        });
    }
}

async function create(server) {
    wss = new WebSocketServer(server);
}

function findConnection(uid, jti) {
    if (!wss.clients.has(uid)) return false;
    if (!jti) return wss.clients.get(uid);
    if (!wss.clients.get(uid).has(jti)) return false;
    return wss.clients.get(uid).get(jti);
}

async function sendR(object) {
    object._uuid = uuidv1();
    const string = JSON.stringify(object);
    const promise = new Promise((resolve) => {
        wss.waiting.set(object._uuid, resolve);
    });

    this.send(string);
    return promise;
}

module.exports = {
    create,
    findConnection,
};
