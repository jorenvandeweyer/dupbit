const Sequelize = require('sequelize');

const Model = Sequelize.Model;
class Token extends Model {}

module.exports = (sequelize) => {
    Token.init({
        exp: {
            type: Sequelize.DATE,
            defaultValue: () => {
                return Date.now() + 10*365*24*60*60*1000;
            },
            allowNull: false
        },
        iat: {
            type: Sequelize.DATE,
            defaultValue: Date.now,
            allowNull: false,
        },
        jti: {
            type: Sequelize.INTEGER, 
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        toe: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: () => {
                return Date.now() + 60*1000;
            }
        },
    }, {
        sequelize,
        modelName: 'token',
    });

    return Token;
};
