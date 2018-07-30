const request = require("request");

module.exports = async (song) => {
    const r = request.defaults({ encoding: null });

    const ytid = song.url.split("watch?v=")[1].split("&")[0];
    
    return new Promise((resolve, reject) => {
        r.get(`https://img.youtube.com/vi/${ytid}/0.jpg`, function (err, res, body) {
            if (err) return reject(err);
            resolve(body);
        });
    }).catch(e => {
        console.log(e);
        return null;
    });
};
