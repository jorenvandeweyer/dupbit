const db = require("../../../src/util/Database");

async function resolve(data, apidata) {
    if (data.sid && apidata.session.isLoggedIn && apidata.session.level >= 2) {
        const uid = await db.getUserOfSong(data.sid);
        if (uid === apidata.session.id) {
            await db.removeSong(data.sid);
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
