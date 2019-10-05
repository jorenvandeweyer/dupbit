const fs = require('fs').promises;
const NodeID3 = require('node-id3');
const db = require('../database');
const downloader = require('./downloader');

const providers = {
    'youtube': require('./providers/youtube'),
    'soundcloud': require('./providers/soundcloud'),
    'unknown': require('./providers/unknown'),
};

/**
 * 
 * @param {*} data 
 * {
 *      provider
 *      title
 *      artist
 *      url
 *      uid
 * }
 */
async function convert(musicData, socket=false) {
    const computed = await compute(musicData, false);

    let songRaw = await db.SongsRaw.findOne({
        where: {filename: computed.hash},
    });

    if (!songRaw) {
        const download = new downloader(computed.url, `${computed.hash}.mp3`);
        download.autoResolve = false;
        download.on('finished', async() => {
            songRaw = await db.SongsRaw.create({
                filename: computed.hash,
                url: computed.url,
                provider: musicData.provider,
            });
            download.resolve(songRaw);
        });
        (socket && musicData.qid) && download.on('state-change', (data) => {
            socket.send(JSON.stringify({
                update: {
                    qid: musicData.qid,
                    data,
                },
            }));
        });

        await download._promise;
    }

    const song = await songRaw.createSong({
        title: musicData.title,
        artist: musicData.artist,
        uid: musicData.uid,
    });


    return {
        song,
        songRaw,
    };
}

async function stream(song, retry=true) {
    try {
        return await fs.readFile(`${process.env.FILES_PATH}/youtube-dl/${song.raw.filename}.mp3`);
    } catch(e) {
        if (!retry) return false;
        await new downloader(song.raw.url, `${song.raw.filename}.mp3`)._promise;
        return stream(song, false);
    }
}

async function download(song) {
    const file = await stream(song);
    if (!file) return false;

    const name = createFilename(song.title, song.artist, song.raw.url);
    const computed = await compute({
        ...song,
        ...song.raw,
    });


    const tags = {
        title: song.title,
        artist: song.artist,
        image: {
            mime: 'jpeg',
            type: {
                id: 3,
                name: 'front cover',
            },
            description: 'thumbnail',
            imageBuffer: computed.cover,
        },
    };

    return {
        name,
        file: NodeID3.update(tags, file),
    };
}

function createFilename(title, artist, url) {
    if (title !== '' && artist !==  '') return `${artist} - ${title}`;
    if (title !== '') return title;
    if (artist !== '') return artist;
    if (url.includes('watch?v=')) return url.split('watch?v=')[1].split('&')[0];
    return url;
}

async function compute(musicData, gc) {
    let provider = providers['unknown'];

    if (musicData.provider in providers) {
        provider = providers[musicData.provider];
    }

    return await provider(musicData, gc);
}

module.exports = {
    convert,
    stream,
    download,
    createFilename,
};
