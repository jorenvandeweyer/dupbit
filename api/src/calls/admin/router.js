const express = require('express');

module.exports =  express.Router()
    .use((req, res, next) => {
        if (!req.auth || !req.auth.hasPermissions('ADMIN')) 
            return res.errors.needAuth();
        next();
    })
    .use('/logs', require('./logs'))
    .use('/users', require('./users'));
