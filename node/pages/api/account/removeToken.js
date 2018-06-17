const db = require("../../../src/util/Database");

async function resolve(data, apidata) {
    if (apidata.session.isLoggedIn && data.tid) {
        const result = await db.getToken({tid: data.tid});
        if (result.length) {
            const token = result[0];
            if (token.uid === apidata.session.id) {
                await db.removeToken(token.id);
                return {
                    success: true,
                    reason: "deleted token",
                };
            }
        }
        return {
            success: false,
            reason: "Not a token",
        };
    }
    return {
        success: false,
    };
}

module.exports = {
    resolve
};
