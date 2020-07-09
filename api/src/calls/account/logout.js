const express = require('express');

module.exports = express.Router()
    .all('/', async (req, res) => {
        if (req.auth) await req.auth.destroy();

        res.jsons({
            logout: !!req.auth,
        });

    });
