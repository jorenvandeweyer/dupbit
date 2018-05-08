const ws = require("../../src/websocket/index");
const db = require("../../src/util/Database");

async function resolve(data, apidata) {
    if (apidata.session.isLoggedIn) {
        const uid = apidata.session.id;
        let tokens = await db.getToken({ uid });

        tokens = tokens.filter(token => token.device === "desktop_app");

        if (tokens.length === 1) {
            const socket = ws.findConnection(uid, tokens[0].id);
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
        }
    }
    return {
        success: false,
    };
}

module.exports = {
    resolve,
};

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
