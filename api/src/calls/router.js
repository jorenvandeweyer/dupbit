const express = require('express');

module.exports =  express.Router()
    .use((req, res, next) => {
        req.computed = {};
        next();
    })
    .use('/account', require('./account/router'))
    .all('*', (req, res) => {
        res.status(404).jsonf({
            reason: 'api call not found',
        });
    });
