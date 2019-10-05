const express = require('express');
const wss = require('../../websocket');

module.exports =  express.Router()
    .get('/', async (req, res) => {
        let sockets = await wss.findConnection(req.auth.uid);
        if (!sockets || !sockets.size) sockets = [];

        sockets = Array.from(sockets.keys()).map(key => new Object({
            id: key,
            auth: sockets.get(key).auth,
        }));

        res.jsons({
            sockets,
        });
    })
    .post('/', async (req, res) => {
        const data = req.body;

        if (!data.jti || !data.call) 
            return res.errors.incomplete();

        const socket = wss.findConnection(req.auth.uid, data.jti);
        if (!socket)
            return res.errors.notFound();

        const response = await socket.sendR(data);
        res.json(response);
    });

    
