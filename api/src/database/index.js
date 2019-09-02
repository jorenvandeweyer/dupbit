const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    dialect: 'mariadb',
    logging: false,
    dialectOptions: {
        timezone: process.env.db_timezone
    },
});
  
const state = sequelize
    .authenticate()
    .then(() => {
        // console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const Users = require('./models/user')(sequelize);
const Logs = require('./models/logs')(sequelize);

Users.hasMany(Logs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

sequelize.sync({force: true}).then(async() => {
    Logs.create({
        action: 'DEBUG',
        value: 'test',
    });
});

module.exports = {
    close: () => sequelize.close(),
    Users,
    Logs,
    state,
    Op: Sequelize.Op,
};

