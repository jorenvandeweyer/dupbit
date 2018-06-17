const db = require("../../../src/util/Database");

async function resolve(data, apidata) {
    if (data.name && apidata.session.isLoggedIn && apidata.session.level >= 2) {
        await db.addPlaylist(data.name, apidata.session.id);
        return {
            success: true,
            backdirect: true,
        };
    }
    return {
        succes: false,
    };
}

module.exports = {
    resolve,
};
