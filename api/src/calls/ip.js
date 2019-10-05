const express = require('express');

module.exports =  express.Router()
    .use((req, res) => {
        res.send(req.get('x-real-ip'));
    });
