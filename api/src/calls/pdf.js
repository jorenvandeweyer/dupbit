const express = require('express');
const pdf = require('../utils/pdf');

module.exports =  express.Router()
    .get('/', async (req, res) => {
        const buffer = await pdf.create();
        res.setHeader('Content-disposition', 'inline; filename=cv.pdf');
        res.setHeader('content-type', 'application/pdf');
        res.end(buffer);
    });
