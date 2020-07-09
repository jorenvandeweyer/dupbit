const express = require('express');
const { convert, createFilename} = require('../../music');

module.exports = express.Router()
    .use(async (req, res, next) => {
        if (!req.auth) 
            return res.errors.needAuth();
        next();
    })
    .post('/', async (req, res, next) => {
        if (req.auth.hasPermissions('PROJECTS.MUSIC'))
            return next();

        const data = req.body;

        const id = req.auth.uid;

        if (!data.redirect) return res.redirect(`/music/metadata/${id}`); //maybe remove this?

        res.jsons({
            id,
            downloadUrl: `/music/metadata/${id}`,
            filename: createFilename(data.title, data.artist, data.url),
        });
    })
    .post('/', async (req, res) => {
        const data = req.body;

        if (!data.url) return res.errors.incomplete();

        const socket = false; //find socket

        const {song, songRaw} = await convert({
            provider: data.provider ? data.provider : 'unknown',
            title: data.title,
            artist: data.artist,
            url: data.url,
            uid: req.auth.uid,
        }, socket);

        res.jsons({
            song,
            songRaw,
            downloadUrl: `/music/song/${song.get().id}/download`,
            filename: createFilename(data.title, data.artist, data.url),
        });
    });

