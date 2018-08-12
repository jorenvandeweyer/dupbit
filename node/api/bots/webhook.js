const { webhookAuth } = require("../../config.json");
// const { query } = require("../../src/util/Database");

module.exports = async (req, res) => {
    const auth = req.get("authorization");
    const query = req.body;
    if (auth === webhookAuth) {
        console.log(query);
        res.send();
    } else {
        res.status(404).json({success: false});
    }
};
