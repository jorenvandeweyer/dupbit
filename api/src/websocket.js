const cookie = require('cookie');
const authResolver = require('./auth');
const { WebSocketServer } = require('websocket-request');

class WSS extends WebSocketServer {
    constructor() {
        super();
    }

    async upgrade(req, socket, head) {
        console.log('upgrading connection');

        if (req.headers.cookie) {
            req.cookies = cookie.parse(req.headers.cookie);
        } else {
            req.cookies = {};
        }

        const auth = await authResolver(req);

        if (!auth) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
        } else {
            super.upgrade(req, socket, head, auth);
        }
    }

    findSafe(uid, uuid) {
        const client = this.find(uuid);

        if (!client || client._auth.uid !== uid) {
            return null;
        }

        return client;
    }

    listSafe(uid) {
        return this.list()
            .filter(client => client._auth.uid === uid);
    }
}

const wss = new WSS();

wss.on('message', (message) => {
    console.log('message received', message.raw);

    try {
        const { action, data } = message.content;

        handle(message, action, data);
    } catch(e) {
        message.reject('Message content not supported');
    }
});

async function handle(message, action, data) {
    if (!(action in ACTIONS)) {
        return message.reject('Action not supported');
    }

    try {
        const result = await ACTIONS[action](message, data);
        message.resolve(result);
    } catch (e) {
        message.reject(e);
    }
}

const ACTIONS = {
    list(message) {
        const sockets = wss.listSafe(message._wsc._auth.uid)
            .map(socket => socket.data);

        message.resolve(sockets);
    }
};

module.exports = wss;
