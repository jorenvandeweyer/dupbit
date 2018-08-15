const Url = require("./util/Url");

module.exports = async (req, res, next) => {
    const url = await Url.new(req.originalUrl, ".js");

    if (url.isFile()) {
        require(url.fullPath)(req, res, next);
    } else {
        res.status(404).json({
            success: false,
            reason: "not found"
        });
    }
};
