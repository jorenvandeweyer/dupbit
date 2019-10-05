const express = require('express');
const db = require('../../database');

const PlaylistRouter = express.Router({mergeParams: true})
    .use(async (req, res, next) => {
        const playlist = await db.Playlists.findOne({
            where: {uid: req.auth.uid, id: req.params.playlist},
            include: [db.SongsInPlaylist],
        });

        if (!playlist)
            return res.errors.notFound();

        req.computed.playlist = playlist;
        next();
    })
    .get('/', async (req, res) => {
        res.jsons({
            playlist: req.computed.playlist,
        });
    })
    .put('/', async (req, res) => {
        if (!req.body.name)
            return res.errors.incomplete();

        const playlist = req.computed.playlist;
        
        const result = await playlist.update({
            name: req.body.name,
        });

        res.jsons({
            playlist: result,
        });
    })
    .delete('/', async (req, res) => {
        try {
            await req.computed.playlist.destroy();
            res.jsons();
        } catch (e) {
            res.errors.db(e);
        }
    });

module.exports =  express.Router()
    .get('/', async (req, res) => {
        const playlists = await db.Playlists.findAll({
            where: {uid: req.auth.uid},
            include: [db.SongsInPlaylist],
        });
        res.jsons({
            playlists,
        });
    })
    .post('/', async (req, res) => {
        if (!req.body.name) return res.errors.incomplete();

        const playlist = await db.Playlists.create({
            name: req.body.name,
            uid: req.auth.uid,
        });

        res.jsons({
            playlist,
        });
    })
    .use('/:playlist', PlaylistRouter);
