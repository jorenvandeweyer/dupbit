const destroyToken = require("../../src/util/destroyToken");

module.exports = async (req, res) => {
    await destroyToken(req.auth.tid, req.auth.uid);

    res.clearCookie("sid", {
        // secure: true
    });

    res.redirect("back");
};
