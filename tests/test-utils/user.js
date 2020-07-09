const crypto = require('crypto');
const db = require('../../api/src/database');
const request = require('supertest');
const app = require('../../api/src/index');
const parseCookies = require('./parseCookies');

const options = {
    req: {
        ip: '0.0.0.0',
    },
};

async function createUser(...permissions) {
    const username = crypto.randomBytes(8).toString('hex');
    const password = crypto.randomBytes(8).toString('hex');

    const user = await db.Users.create({
        username,
        password,
        email: `${username}@dupbit.com`
    }, options);

    if (permissions) {
        await user.setPermissions(...permissions);
    }

    const res = await request(app).post('/account/login')
        .send({
            username,
            password,
        });

    const cookies = parseCookies(res.get('Set-Cookie'));

    return {
        user,
        username,
        password,
        sid: cookies.get('sid').value,
    };
}

async function destroyUser(user) {
    await user.user.destroy();
}

module.exports = {
    createUser,
    destroyUser,
};
