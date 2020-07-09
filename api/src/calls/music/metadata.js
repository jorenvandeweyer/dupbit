const express = require('express');

module.exports = express.Router()
    .get('/:id', async (req, res) => {
        const id = req.params.id;
        res.set('Content-Type', 'application/json');
        res.set('Content-disposition', `attachment; filename=${id}.json`);
        res.send(JSON.stringify({
            id,
        }));
    });

