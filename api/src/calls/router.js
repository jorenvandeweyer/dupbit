const express = require('express');

module.exports =  express.Router()
    .use((req, res, next) => {
        req.computed = {};
        next();
    })
    .use('/account', require('./account/router'))
    .use('/calendar', require('./calendar'))
    .use('/music', require('./music/router'))
    .use('/admin', require('./admin/router'))
    .use('/pdf', require('./pdf'))
    .all('*', (req, res) => {
        res.status(404).jsonf({
            reason: 'api call not found',
        });
    });
