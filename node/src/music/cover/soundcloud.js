const request = require("request");

module.exports = async (song) => {
    const r = request.defaults({ encoding: null });

    return new Promise((resolve, reject) => {
        r.post("https://soundcloud.com/oembed", {
            form: {
                url: song.url,
                format: "json",
            }
        }, function (err, res, body) {
            if (err) return reject(err);
            const data = JSON.parse(body);
            r.get(data.thumbnail_url, (err, res, body) => {
                if (err) return reject(err);
                resolve(body);
            });
        });
    }).catch(e => {
        console.log(e);
        return null;
    });
};
