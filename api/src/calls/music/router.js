const express = require('express');

module.exports =  express.Router()
    .use((req, res, next) => {
        if (!req.auth)
            return res.errors.needAuth();
        next();
    })
    .use('/convert', require('./convert'))
    .use('/metadata', require('./metadata'))
    .use((req, res, next) => {
        if (!req.auth.hasPermissions('PROJECTS.MUSIC')) 
            return res.errors.needAuth();
        next();
    })
    .use('/song', require('./song'))
    .use('/playlist', require('./playlist'));
