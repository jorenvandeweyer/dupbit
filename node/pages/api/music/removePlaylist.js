const db = require("../../../src/util/Database");

async function resolve(data, apidata) {
    if (data.pid && apidata.session.isLoggedIn && apidata.session.level >= 2) {
        const uid = await db.getUserOfPlaylist(data.pid);
        if (uid === apidata.session.id) {
            await db.removePlaylist(data.pid);
            return {
                success: true,
                backdirect: true,
            };
        }
    }
    return {
        success: false,
    };
}

module.exports = {
    resolve,
};
