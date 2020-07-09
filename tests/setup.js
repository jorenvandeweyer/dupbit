require('dotenv').config({path: './.env.test'});

const db = require('../api/src/database');

module.exports = async () => {
    await db.state;
};
