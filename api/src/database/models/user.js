const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const Model = Sequelize.Model;
class User extends Model {
    async matchPassword(password, options) {
        const result = await bcrypt.compare(password, this.password);

        await this.createLog({
            username: this.username,
            action: 'LOGIN_ATTEMPT',
            ip: options.req.ip,
            success: result,
        });

        return result;
    }
}

const hashPasswordHook = async function(user) {
    if (!user.changed('password')) return;
    
    const hash = await bcrypt.hash(user.get('password'), 10);
    user.set('password', hash);
};

const changeHook = async function(user, options) {
    if (user.changed('password')) 
        await newLog(user, 'CHANGED_PASSWORD', null, options);
    if (user.changed('username')) 
        await newLog(user, 'CHANGED_USERNAME', user.username, options);
    if (user.changed('email')) 
        await newLog(user, 'CHANGED_EMAIL', user.email, options);
};

async function newLog(user, action, value, options) {
    return user.createLog({
        username: user.username,
        action,
        value,
        ip: options.req.ip,
    });
}

module.exports = (sequelize) => {
    User.init({
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        level: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        }
    }, {
        sequelize,
        modelName: 'user'
    });

    User.beforeCreate(hashPasswordHook);
    User.beforeUpdate(hashPasswordHook);

    User.afterCreate(changeHook);
    User.afterUpdate(changeHook);
    return User;
};
