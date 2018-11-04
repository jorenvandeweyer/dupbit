const bcrypt = require("bcrypt");
const db = require("../../src/util/Database");
const destoryToken = require("../../src/util/destroyToken");

module.exports = async (req, res) => {
    const data = req.body;

    if (!req.auth.isLoggedIn) return res.errors.needAuth();
    
    if (!data.hash) return res.errors.incomplete();

    const hash = await db.getPasswordByID(req.auth.uid);
    const match = await bcrypt.compare(hash, data.hash);
    if (!match) return res.errors.wrongCredentials();

    const tokens = await db.getTokens(req.auth.uid);
    for (token of tokens) {
        await destoryToken(token.tid, token.uid);
    }

    res.json({
        success: true,
    });
};
