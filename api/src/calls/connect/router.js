const express = require('express');

module.exports =  express.Router()
    .use((req, res, next) => {
        if (!req.auth && req.auth.hasPermissions('PROJECTS.CONNECT'))
            return res.errors.needAuth();
        next();
    })
    .use('/', require('./index'));

