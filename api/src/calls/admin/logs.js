const express = require('express');
const db = require('../../database');

module.exports = express.Router()
    .use((req, res, next) => {
        if (!req.auth || !req.auth.hasPermissions('ADMIN')) 
            return res.errors.needAuth();
        next();
    })
    .get('/', async (req, res) => {
        const data = req.query;

        const logs = await db.Logs.findAll({
            where: (data.action) ? {action: data.action} : undefined,
            limit: (data.limit) ? +data.limit : 100,
            offset: (data.offset) ? +data.offset : 0,
            order: [['createdAt', 'DESC']],
        });

        res.jsons({
            logs,
            offset: logs.length + ((data.offset) ? +data.offset : 0),
        });
    });

