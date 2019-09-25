const express = require('express');

module.exports = express.Router()
    .all('/', async (req, res) => {
        res.clearCookie('sid', {
            domain: '.boerzoektbier.be'
            // secure: true
        });

        if (req.auth) await req.auth.destroy();

        res.jsons({
            logout: !!req.auth,
        });

    })
    .all('/', (_req, res) => {
        res.errors.method();
    });
