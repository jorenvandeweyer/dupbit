const db = require("../../src/util/Database");
const verifyUser = require("../../src/util/verifyUser");

module.exports = async (req, res) => {
    const data = req.body;

    if (!req.auth.isLoggedIn) return res.errors.needAuth();
    
    if (!data.name) return res.errors.incomplete();

    const canChange = await db.canDoUsernameChange(req.auth.uid);
    if (!canChange) return res.errors.custom("You can only change your username once a month.")
    
    const errorCode = await verifyUser.verifyUsername(data.name, req.auth.username);

    if (errorCode !== 0) {
        console.log(data.name, errorCode);
        return res.status(400).json({
            success: false,
            username: verifyUser.decodeErrorCode(errorCode),
        });
    }

    db.addUsernameChange(req.auth.uid, data.name);
    db.setUsername(req.auth.uid, data.name);
    console.log("change:", canChange);

    res.json({
        success: "busy",
    });
}
