const express = require('express');
const wss = require('../../websocket');

module.exports =  express.Router()
    .get('/', async (req, res) => {
        const sockets = wss.listSafe(req.auth.uid)
            .map(socket => socket.data);

        res.jsons({
            sockets,
        });
    })
    .post('/', async (req, res) => {
        const data = req.body;

        if (!req.hasParams('uuid')) return;

        const socket = wss.findSafe(req.auth.uid, data.uuid);

        try {
            const response = await socket.send({
                type: data.type,
                content: data.content,
            });

            res.jsons({response});
        } catch(response) {
            console.log('error', response);
            res.jsonf({response});
        }
    });
