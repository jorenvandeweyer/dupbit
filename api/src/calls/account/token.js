const express = require('express');
const db = require('../../database');

module.exports = express.Router()
    .use((req, res, next) => {
        if (!req.auth) return res.errors.needAuth();
        next();
    })
    .get('/', (req, res) => {
        res.jsons(req.auth);
    })
    .get('/raw', (req, res) => {
        res.jsons({
            token: req.auth.raw(),
        });
    })
    .get('/all', async (req, res) => {
        const tokens = await db.Tokens.findAll({where: {uid: req.auth.uid}});
        res.jsons({
            tokens
        });
    })
    // .post('/', async (req, res) => {
    // })
    // .put('/', async (req, res) => {
    // })
    .delete('/:jti', async (req, res) => {
        res.jsonf();
    })
    .delete('/all', async (req, res) => {
        const data = req.body;

        if (!await authorise(data))
            return res.errors.wrongCredentials();
    });


async function authorise(data) {
    if (data.password) {
        return false;
    }
    if (data.hash) {
        return false;
    }
}
