const express = require('express');

module.exports =  express.Router()
    .use('/logs', require('./logs'));
