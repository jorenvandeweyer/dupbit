const ws = require("../../../src/websocket/index");
const db = require("../../../src/util/Database");

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
                        name: "screen",
                        data: {
                            action: data.action,
                        },
                    },
                }));
                return {
                    success: true,
                };
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
