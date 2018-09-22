const Token = require("../../src/util/Token");

module.exports = async (req, res) => {
    await Token.removeToken(req.auth.tid, req.auth.id);

    res.clearCookie("sid", {
        // secure: true
    });

    res.redirect("back");
};
