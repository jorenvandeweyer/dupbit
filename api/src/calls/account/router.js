const express = require('express');

module.exports =  express.Router()
    .use((req, res, next) => {
        req.computed = {};
        next();
    })
    .use('/login', require('./login'))
    .use('/logout', require('./logout'))
    // .use('/forgot', require('./forgot'))
    .use('/verify', require('./verify'))
    .use('/token', require('./token'))
    .use('/', require('./user'));
