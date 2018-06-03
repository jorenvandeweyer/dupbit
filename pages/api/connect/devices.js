const db = require("../../../src/util/Database");
const ws = require("../../../src/websocket/index");

async function resolve(data, apidata) {
    if (apidata.session.isLoggedIn) {
        const tokens = await db.getToken({uid: apidata.session.id});
        const clients = await ws.getClient(apidata.session.id);

        const obj = {
            website: {},
            desktop_app: {},
            extension: {},
        };

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (token.device === "website") {
                token.online = clients && clients.has(token.id);
                if (token.online) {
                    obj.extension[token.id] = token;
                } else {
                    obj.website[token.id] = token;
                }
            } else if (token.device === "desktop_app") {
                token.online = clients && clients.has(token.id);
                obj.desktop_app[token.id] = token;
            }

            token.info = JSON.parse(token.name);

            switch (token.info.os) {
                case "Darwin":
                    token.info.os_parsed = "apple";
                    break;
                case "Windows":
                    token.info.os_parsed = "windows";
                    break;
                case "Linux":
                    token.info.os_parsed = "linux";
                    break;
                default:

            }
        }

        return {
            success: true,
            data: obj,
        };
    }
    return {
        success: false,
    };
}

module.exports = {
    resolve,
};
