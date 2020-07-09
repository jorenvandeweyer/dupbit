const express = require('express');

module.exports =  express.Router()
    .use('/login', require('./login'))
    .use('/logout', require('./logout'))
    // .use('/forgot', require('./forgot'))
    .use('/verify', require('./verify'))
    .use('/validate', require('./validate'))
    .use('/token', require('./token'))
    .use('/', require('./user'));
