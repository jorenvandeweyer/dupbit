const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const permissions = require('../permissions');

const user_perms = {
    'EMAIL.VALID': 1 << 0,
    'ADMIN': 1 << 1,
};

const Model = Sequelize.Model;
class User extends Model {
    static get allPermissions() {
        return user_perms;
    }

    static checkPermissions(int, ...perm) {
        permissions.exists(perm, user_perms);
        return permissions.has(int, perm, user_perms);
    }

    get safe() {
        const obj = this.get();
        obj.password = undefined;
        obj.permissions = this.getPermissions();
        return obj;
    }
    get hash() {
        return bcrypt.hash(this.password, 10);
    }

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
    async reverseMatch(hash) {
        return await bcrypt.compare(this.password, hash);
    }

    getPermissions() {
        return permissions.parse(this.permissions, user_perms);
    }
    hasPermissions(...perm) {
        permissions.exists(perm, user_perms);
        return permissions.has(this.permissions, perm, user_perms);
    }
    async setPermissions(...perm) {
        permissions.exists(perm, user_perms);
        this.permissions = permissions.set(this.permissions, perm, user_perms);
        await this.save();
    }
    async delPermissions(...perm) {
        permissions.exists(perm, user_perms);
        this.permissions = permissions.remove(this.permissions, perm, user_perms);
        await this.save();
    }
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
        permissions: {
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
    if (user.changed('permissions'))
        await newLog(user, 'CHANGED_PERMISSIONS', user.permissions, options);
};

async function newLog(user, action, value, options) {
    return user.createLog({
        username: user.username,
        action,
        value,
        ip: (options.req) ? options.req.ip : null,
    });
}
