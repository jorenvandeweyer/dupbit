const { webhookAuth } = require("../../config.json");
const db = require("../../src/util/Database");

module.exports = async (req, res) => {
    const auth = req.get("authorization");
    const query = req.body;
    if (auth === webhookAuth) {
        await db.query("INSERT INTO discordbots.webhook_dbl (bot, user, type, query) values (?, ?, ?, ?)", [query.bot, query.user, query.type, query.query]);
        res.send();
    } else {
        res.status(404).json({success: false});
    }
};
