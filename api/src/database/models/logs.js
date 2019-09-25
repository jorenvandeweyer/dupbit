const Sequelize = require('sequelize');

const Model = Sequelize.Model;
class Logs extends Model {}

const ACTIONS = [
    'DEBUG',
    'ERROR',
    'CHANGED_USERNAME',
    'CHANGED_EMAIL',
    'CHANGED_PASSWORD',
    'CHANGED_PERMISSIONS',
    'LOGIN_ATTEMPT',
];

module.exports = (sequelize) => {
    Logs.init({
        action: {
            type: Sequelize.ENUM(...ACTIONS),
            allowNull: false,
        },
        username: {
            type: Sequelize.STRING,
        },
        ip: {
            type: Sequelize.STRING,
        },
        value: {
            type: Sequelize.STRING,
        },
        success: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        metadata: {
            type: Sequelize.JSON,
        }
    }, {
        sequelize,
        name: {
            singular: 'log',
            plural: 'logs',
        },
        modelName: 'log',
    });

    return Logs;
};
