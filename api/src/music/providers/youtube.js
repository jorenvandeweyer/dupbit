const rp = require('request-promise');
const crypto = require('crypto');

module.exports = async (song, gc=true) => {
    const ytid = song.url.split('watch?v=')[1].split('&')[0];
    
    const cover = await getCover(ytid, gc);

    return {
        id: ytid,
        cover,
        hash: crypto.createHash('md5').update(ytid).digest('hex'),
        url: `https://www.youtube.com/watch?v=${ytid}`,
    };
};

async function getCover(ytid, gc) {
    if (!gc) return false;
    return await rp.get(`https://img.youtube.com/vi/${ytid}/0.jpg`).catch(() => null);
}
