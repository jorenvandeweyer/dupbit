const crypto = require('crypto');

module.exports = async (song) => {
    return {
        cover: null,
        hash: crypto.createHash('md5').update(song.url).digest('hex'),
        url: song.url,
    };
};
