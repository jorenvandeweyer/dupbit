const rp = require('request-promise');
const crypto = require('crypto');

module.exports = async (song, gc=true) => {
    const cover = await getCover(song.url, gc);

    return {
        cover,
        hash: crypto.createHash('md5').update(song.url).digest('hex'),
        url: song.url,
    };
};

async function getCover(url, gc) {
    if (!gc) return false;

    const res = rp.post('https://soundcloud.com/oembed', {
        form: {
            url,
            format: 'json',
        }
    }).catch(() => null);

    if (!res) return null;

    return await rp.get(res.thumbnail_url).catch(() => null);
}
