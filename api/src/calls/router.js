const express = require('express');
module.exports =  express.Router()
    .use((req, res, next) => {
        req.computed = {};
        next();
    })
    .all('*', (req, res) => {
        res.status(404).json({
            reason: 'api call not found',
        });
    });
