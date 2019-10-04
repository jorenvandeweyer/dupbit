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
    .then(async () => {
        await sequelize.sync();    
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const Users = require('./models/user')(sequelize);
const Logs = require('./models/logs')(sequelize);
const Tokens = require('./models/token')(sequelize);
const Calendars = require('./models/calendar')(sequelize);

Users.hasMany(Logs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Users.hasMany(Tokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'uid',
});

Users.hasMany(Calendars, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'uid',
});

module.exports = {
    close: () => sequelize.close(),
    sync: (force) => sequelize.sync({force}),
    state,
    Users,
    Logs,
    Tokens,
    Calendars,
    Op: Sequelize.Op,
};

