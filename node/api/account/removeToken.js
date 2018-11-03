const db = require("../../src/util/Database");
const destroyToken = require("../../src/util/destroyToken");

module.exports = async (req, res) => {
    const data = req.query;

    if (!req.auth.isLoggedIn) return res.errors.needAuth();
    if (!data.tid) return res.errors.incomplete();

    const result = await db.getToken(data.tid);

    if (!result || !result.length) 
        return res.errors.custom("not a token");

    const token = result[0];

    if (token.uid !== req.auth.uid)
        return res.errors.custom("not a token");

    await destroyToken(token.tid, token.uid);
    
    res.json({
        success: true,
    });
};
