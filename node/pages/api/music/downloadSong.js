const fs = require("fs");
const db = require("../../../src/util/Database");
const NodeID3 = require("node-id3");
const request = require("request");

const { downloadVideo } = require("./convert.js");

async function resolve (data, apidata) {
    if (apidata.session.isLoggedIn && apidata.session.level >= 2 && data.id) {
        const song = await db.getSong(data.id);
        if (song.uid === apidata.session.id) {
            let file = await getSong(song.ytid);
            const name = songName(song);

            const image = await requestAlbumCover(song.ytid);

            let tags = {
                title: song.title,
                artist: song.artist,
                image: {
                    mime: "jpeg",
                    type: {
                        id: 3,
                        name: "front cover"
                    },
                    description: "thumbnail",
                    imageBuffer: image
                }
            };

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

function requestAlbumCover(ytid) {
    const r = request.defaults({ encoding: null });

    return new Promise((resolve, reject) => {
        r.get(`https://img.youtube.com/vi/${ytid}/0.jpg`, function (err, res, body) {
            if (err) return reject(err);
            resolve(body);
        });
    }).catch(e => {
        console.log(e);
        return null;
    });
}

module.exports = {
    resolve,
    getSong,
};
