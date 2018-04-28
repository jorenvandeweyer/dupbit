const fs = require("fs");
const db = require("../../../src/util/Database");
const NodeID3 = require('node-id3');

const id3 = require("../../../src/util/Id3");
const { downloadVideo } = require("./convert.js");

async function resolve (data, apidata) {
    if (apidata.session.isLoggedIn && apidata.session.level >= 2 && data.id) {
        const song = await db.getSong(data.id);
        if (song.uid === apidata.session.id) {
            let file = await getSong(song.ytid)
            const name = songName(song);

            let tags = {
              title: song.title,
              artist: song.artist,
            }

            return {
                success: true,
                download: NodeID3.update(tags, file),
                name: name + ".mp3",
            };
        }
    }
    return {
        success: false,
    };
}

async function getSong(ytid) {
    if (!fs.existsSync(`data/music/${ytid}.mp3`)) {
        await downloadVideo(`https://youtube.com/watch?v=${ytid}`);
    }
    return fs.readFileSync(`data/music/${ytid}.mp3`);
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
    getSong,
};
