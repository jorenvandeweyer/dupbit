const Sequelize = require('sequelize');

const Model = Sequelize.Model;
class Token extends Model {
    async refresh() {
        this.toe = Date.now() + 60*1000;
        await this.save();
        return this;
    }
    get seconds() {
        const obj = this.get();
        obj.iat = Math.floor(this.iat / 1000);
        obj.exp = Math.floor(this.exp / 1000);
        obj.toe = Math.floor(this.toe / 1000);
        return obj;
    }
}

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
