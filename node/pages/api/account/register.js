const Database = require("../../../src/util/Database");

module.exports = async (req, res) => {
    const data = req.body;

    if (data.username && data.password && data.confirmpassword && data.email) {
        const errorCode = await Database.verifyRegistration(data.username, data.password, data.confirmpassword, data.email);

        if (errorCode === 0) {
            await Database.register(data.username, data.password, data.email);
            const id = await Database.getIDByUsername(data.username);
            await Database.addUsernameChange(id, data.username);
            res.redirect("/index");
        } else {
            res.redirect(`/register?fail=${errorCode}`);
        }
    } else {
        res.json({
            success: false,
            reason: "missing params",
        });
    }
};
