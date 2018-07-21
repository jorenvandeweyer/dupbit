const fs = require("fs");
const Url = require("./util/Url");

module.exports = async (req, res) => {
    const url = new Url(req.originalUrl, ".js");

    if (fs.existsSync(url.fullPath)) {
        require(url.fullPath)(req, res);
    } else {
        res.status(404).json({
            success: false,
            reason: "not found"
        });
    }
};
