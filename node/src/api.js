const fs = require("fs");
const Url = require("./util/Url");

module.exports = async (req, res, next) => {
    const url = new Url(req.originalUrl, ".js");
    req._url = url;

    if (fs.existsSync(url.fullPath)) {        
        require(url.fullPath)(req, res, next);
    } else {
        res.status(404).json({
            success: false,
            reason: "not found"
        });
    }
};
