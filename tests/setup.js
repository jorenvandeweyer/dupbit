process.env.MYSQL_HOST = '127.0.0.1';
process.env.MYSQL_DATABASE = 'test';
process.env.NODE_ENV = 'test';

require('dotenv').config();

const db = require('../api/src/database');

module.exports = async () => {
    await db.state;
};
