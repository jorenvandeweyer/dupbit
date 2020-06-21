const express = require('express');
const wss = require('../../websocket');

module.exports =  express.Router()
    .get('/', async (req, res) => {
        const sockets = await wss.list(req.auth.uid);

        res.jsons({
            sockets,
        });
    })
    .post('/', async (req, res) => {
        const data = req.body;

        if (!req.hasParams('uuid', 'action')) return;

        const socket = wss.find(req.auth.uid, data.uuid);

        try {
            const response = await socket.send({
                action: data.action,
                content: data.content,
            });

            res.jsons(response);
        } catch(err) {
            res.jsonf(err);
        }
    });
