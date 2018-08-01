const crypto = require("crypto");

module.exports = (url) => {
    return {
        hash: crypto.createHash("md5").update(url).digest("hex"),
        url,
    };
};
