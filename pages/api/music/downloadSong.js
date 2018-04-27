const fs = require("fs");
const db = require("../../../src/util/Database");
const id3 = require("../../../src/util/Id3");

async function resolve (data, apidata) {
    if (apidata.session.isLoggedIn && apidata.session.level >= 2 && data.id) {
        const song = await db.getSong(data.id);
        if (song.uid === apidata.session.id) {
            let file;
            if (song.cached) {
                id3.removeID3(`data/music/${song.ytid}.mp3`);
                file = fs.readFileSync(`data/music/${song.ytid}.mp3`);
            } else {
                //download again
            }
            let name = songName(song);
            return {
                success: true,
                download: id3.createID3Tag(song.title, song.artist) + file,
                name: name + ".mp3",
            };
        }
    }
    return {
        success: false,
    };
}

function songName(song) {
    if (song.title && song.artist) {
        return `${song.artist} - ${song.title}`;
    } else if (song.title && !song.artist) {
        return song.title;
    } else if (!song.title && song.artist) {
        return song.artist;
    } else {
        return song.ytid;
    }
}

module.exports = {
    resolve,
};
