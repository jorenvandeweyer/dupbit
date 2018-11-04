const db = require("../../src/util/Database");
const verifyUser = require("../../src/util/verifyUser");

module.exports = async (req, res) => {
    const data = req.body;

    if (!req.auth.isLoggedIn) return res.errors.needAuth();
    
    if (!data.name) return res.errors.incomplete();

    const canChange = await db.canDoUsernameChange(req.auth.uid, 30);
    if (!canChange) return res.json({
        success: false,
        username: ["You can only change your username once a month."],
    });
    
    const errorCode = await verifyUser.verifyUsername(data.name, req.auth.username);

    if (errorCode !== 0) {
        return res.json({
            success: false,
            username: verifyUser.decodeErrorCode(errorCode),
        });
    }

    db.addUsernameChange(req.auth.uid, data.name);
    db.setUsername(req.auth.uid, data.name);

    res.json({
        success: "true",
        new_username: data.name,
    });
}
