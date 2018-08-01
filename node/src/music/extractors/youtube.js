const crypto = require("crypto");

module.exports = (url) => {
    const id = url.split("watch?v=")[1].split("&")[0];
    return {
        id,
        hash: crypto.createHash("md5").update(id).digest("hex"),
        url: `https://www.youtube.com/watch?v=${id}`,
    };
};
