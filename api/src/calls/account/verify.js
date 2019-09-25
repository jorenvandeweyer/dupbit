const express = require('express');
const db = require('../../database');

module.exports = express.Router()
    .get('/', async (req, res) => {
        const data = req.query;
        if (!data.token) return res.errors.incomplete();

        const decoded = req.checkToken(data.token);
        if (!decoded) return res.errors.wrongCredentials();

        const user = await db.Users.findByPk(decoded.uid);
        if (!user || user.hasPermissions('EMAIL.VALID'))
            return res.redirect(`https://${process.env.HOST}/login`);

        await user.setPermissions('EMAIL.VALID');

        res.redirect(`https://${process.env.HOST}/login?verified`);
    })
    .all('/', async (req, res) => {
        res.errors.method();
    });
