require('dotenv').config();

process.env.MYSQL_HOST = '127.0.0.1';
process.env.MYSQL_DATABASE = process.argv[2] || process.env.MYSQL_DATABASE;


const db = require('../api/src/database');

async function main() {
    await db.state;
    await db.sync(true);
    process.exit(0);
}

main();
