const express = require('express');
const db = require('../../database');
const music = require('../../music');

const SongRouter = express.Router({mergeParams: true})
    .use(async (req, res, next) => {
        const song = await db.Songs.findOne({where: {uid: req.auth.uid, id: req.params.song}});
        if (!song) return res.errors.notFound();

        const songRaw = await db.SongsRaw.findOne({where: {id: song.srid}});
        
        const raw = song.get();
        raw.raw = songRaw.get();

        req.computed.song = song;
        req.computed.songRaw = songRaw;
        req.computed.raw = raw;
        next();
    })
    .get('/', async (req, res) => {
        res.jsons({
            song: req.computed.song,
        });
    })
    .get('/stream', async (req, res) => {
        const stream = await music.stream(req.computed.raw);
        res.set('Content-Disposition', 'filename="stream.mp3"');
        res.set('Content-Length', stream.length);
        res.set('Cache-Control', 'no-cache');
        res.set('Content-Transfer-Encoding', 'chunked');
        res.set('Content-Type', 'audio/mpeg');
        res.send(stream);
    })
    .get('/download', async (req, res) => {
        const download = await music.download(req.computed.raw);
        res.set('Content-disposition', `attachment; filename=${download.name}.mp3`);
        res.set('Content-Type', 'audio/mpeg');
        res.send(download.file);
    })
    .put('/', async (req, res) => {
        const data = req.body;
        const song = req.computed.song;

        const result = await song.update({
            title: data.title,
            artist: data.artist,
        }, {include: [db.SongsInPlaylist]});

        res.jsons({
            song: result,
        });
    })
    .delete('/', async (req, res) => {
        try {
            await req.computed.song.destroy();
            res.jsons();
        } catch (e) {
            res.errors.db(e);
        }
    });

module.exports = express.Router()
    .get('/', async (req, res) => {
        const songs = await db.Songs.findAll({
            where: {uid: req.auth.uid}, 
            include: [db.SongsInPlaylist],
        });
        res.jsons({
            songs,
        });
    })
    .post('/', async (req, res) => {
        res.errors.custom('use /music/convert end point');
    })
    .use('/:song', SongRouter);

