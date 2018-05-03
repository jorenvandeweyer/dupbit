const db = require("../../../src/util/Database");

async function resolve (data, apidata) {
    if (apidata.session.isLoggedIn && apidata.session.level >= 2 && data.url && data.title && data.artist) {
        if (data.url.includes("youtube.com/watch?v=")) {
            return await db.addSong(data.url.split("watch?v=")[1].split("&list")[0], data.title, data.artist, data.uid);
        } else {
            return await db.addSong(data.url, data.title, data.artist, data.uid);
        }
    }
}

module.exports = {
    resolve,
};
