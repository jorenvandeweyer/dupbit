const fs = require("fs");
const NodeID3 = require("node-id3");
const db = require("../util/Database");
const downloader = require("./downloader");

async function downloadFromUrl(url, hash) {
    const download = await downloader(url);
    fs.renameSync(`data/music/${download.info}`, `data/music/${hash}.mp3`);
}

async function convert(uid, provider, url, title, artist) {
    let extractor;

    if (fs.existsSync(`${__dirname}/extractors/${provider}.js`)) {
        extractor = require(`./extractors/${provider.toLowerCase()}`);
    } else {
        extractor = require("./extractors/unknown");
    }

    const data = extractor(url);

    let result = await db.getSongRawByName(data.hash);

    if (!result) {
        downloadFromUrl(data.url, data.hash);
        await db.addSongRaw(data.hash, url, provider, true);
        result = await db.getSongRawByName(data.hash);
    }

    const convert = await db.addSong(result.id, uid, title, artist);

    return convert.insertId;
}

async function stream(song) {
    if (!fs.existsSync(`data/music/${song.filename}.mp3`)) {
        await downloadFromUrl(song.url, song.filename);
    }
    return fs.readFileSync(`data/music/${song.filename}.mp3`);
}

async function download(song) {
    const file = await stream(song);
    const name = createFilename(song.title, song.artist, song.url);
    const image = await requestAlbumCover(song);
    const tags = {
        title: song.title,
        artist: song.artist,
        image: {
            mime: "jpeg",
            type: {
                id: 3,
                name: "front cover"
            },
            description: "thumbnail",
            imageBuffer: image,
        },
    };

    return {
        name,
        file: NodeID3.update(tags, file),
    };
}

function createFilename(title, artist, url) {
    if (title !== "" && artist !==  "") return `${artist} - ${title}`;
    if (title !== "") return title;
    if (artist !== "") return artist;
    if (url.includes("watch?v=")) return url.split("watch?v=")[1].split("&")[0];
    return url;
}

function requestAlbumCover(song) {
    let cover;

    if (fs.existsSync(`${__dirname}/cover/${song.provider.toLowerCase()}.js`)) {
        cover = require(`./cover/${song.provider.toLowerCase()}`);
    } else {
        cover = require("./cover/unknown");
    }

    return cover(song);
}

module.exports = {
    convert,
    stream,
    download,
    createFilename,
};
