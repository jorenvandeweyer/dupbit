const Sequelize = require('sequelize');

const Model = Sequelize.Model;
class Logs extends Model {
    static get ACTIONS() {
        return {
            'DEBUG': 'debug',
            'ERROR': 'error',
            'CHANGED_USERNAME': 'changed_username',
            'CHANGED_EMAIL': 'changed_email',
            'CHANGED_PASSWORD': 'changed_password',
            'CHANGED_PERMISSIONS': 'changed_permisssions',
            'LOGIN_ATTEMPT': 'login_attempt',
            'TOKEN_REMOVED': 'token_removed',
        };
    }
}

module.exports = (sequelize) => {
    Logs.init({
        action: {
            type: Sequelize.STRING,
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
