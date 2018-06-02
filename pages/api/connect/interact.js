const ws = require("../../../src/websocket/index");
const db = require("../../../src/util/Database");

async function resolve(data, apidata) {
    if (apidata.session.isLoggedIn && data.tid) {
        const uid = apidata.session.id;
        const token = await getToken(uid, data.tid);
        if (token) {
            console.log(token);
            const socket = ws.findConnection(uid, token.id);
            console.log(socket);
            if (socket) {
                socket.send(JSON.stringify({
                    action: {
                        name: data.name,
                        data: {
                            action: data.action,
                            value: data.value,
                        },
                    },
                }));
                return await waitForResponse(socket, data.name);
            }
        } else {
            return {
                success: false,
                reason: "not a token.",
            };
        }
    } else {
        return {
            success: false,
            reason: "log in and use a proper token id.",
        };
    }

}

module.exports = {
    resolve,
};

async function getToken(uid, tid) {
    let tokens = await db.getToken({ uid });
    const token = tokens.filter(token => token.device === "desktop_app" && token.id === parseInt(tid));
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
