const express = require('express');
const db = require('../../database');

module.exports = express.Router()
    .get('/', async (req, res) => {
        const users = await db.Users.findAll();
        const allPermissions = db.Users.allPermissions;

        res.jsons({
            users: users.map(user => user.safe),
            allPermissions,
        });
    })
    .put('/', async (req, res) => {
        const data = req.body;
        if (!(data.id && data.username && data.email && data.permissions !== undefined))
            return res.errors.incomplete();

        const user = await db.Users.findOne({where: {id: data.id}});
        if (!user) return res.errors.notFound();

        const result = await user.update({
            username: data.username,
            email: data.email,
            permissions: data.permissions,
        });

        res.jsons({
            user: result.safe
        });
    })
    .delete('/:user', async (req, res) => {
        if (!req.params.user) return res.errors.incomplete();

        try {
            await db.Users.destroy({where: {id: req.params.user}});
            res.jsons();
        } catch(e) {
            res.errors.db(e);
        }
    });

