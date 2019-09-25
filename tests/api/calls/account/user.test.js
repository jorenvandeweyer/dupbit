const request = require('supertest');
const crypto = require('crypto');
const app = require('../../../../api/src/index');
const db = require('../../../../api/src/database');

const {send, html} = require('../../../../api/src/utils/mail');

const options = {
    req: {
        ip: '0.0.0.0',
    },
};

jest.mock('../../../../api/src/utils/mail');

describe('testing account user call', () => {
    const username = crypto.randomBytes(8).toString('hex');
    const password = crypto.randomBytes(8).toString('hex');
    const username_new = crypto.randomBytes(8).toString('hex');
    const password_new = crypto.randomBytes(8).toString('hex');
    
    send.mockImplementation(() =>   Promise.resolve());
    html.mockImplementation(() =>   Promise.resolve());

    beforeEach(() => {
        send.mockClear();
        html.mockClear();
    });

    let emailToken;
    let sid;

    test('create account false', async () => {
        const res = await request(app).post('/account')
            .send({
                username,
                password,
            })
            .set('Content-Type', 'application/json')
            .expect(200);

        expect(res.body.errors).toContain('email.required');
    });

    test('create account', async () => {
        const res = await request(app).post('/account')
            .send({
                username,
                email: `${username}@dupbit.com`,
                password,
            })
            .set('Content-Type', 'application/json')
            .expect(200);

        emailToken = html.mock.calls[0][1].button_url.split('?token=')[1];

        expect(res.body.success).toBeTruthy();
        expect(send).toBeCalledTimes(1);
        expect(html).toBeCalledTimes(1);

        //check if user is created;

        const user = await db.Users.findOne({where: {username}});
        expect(user).not.toBeNull();
        expect(user.get().permissions).toBe(0);
    });

    test('login fail', async () => {
        const res = await request(app).post('/account/login')
            .send({
                username,
                password,
            })
            .expect(200);

        expect(res.body.success).toBeFalsy();
    });

    test('verify account', async () => {
        await request(app).get('/account/verify')
            .query({
                token: emailToken,
            })
            .expect(302);

        const user = await db.Users.findOne({where: {username}});
        expect(user).not.toBeNull();
        expect(user.get().permissions).toBe(1);
    });
    
    test('login username', async () => {
        const res = await request(app).post('/account/login')
            .send({
                username,
                password,
            })
            .expect(200);

        const cookies = parseCookies(res.get('Set-Cookie'));
        expect(cookies.has('sid')).toBeTruthy();
    });

    test('login email', async () => {
        const res = await request(app).post('/account/login')
            .send({
                username: `${username}@dupbit.com`,
                password,
            })
            .expect(200);

        const cookies = parseCookies(res.get('Set-Cookie'));
        expect(cookies.has('sid')).toBeTruthy();

        sid = cookies.get('sid').value;
    });

    test('check db token', async() => {
        const user = await db.Users.findOne({where: {username}});
        const tokens = await user.getTokens();

        expect(tokens.length).toBe(2);
    });

    test('get account info without auth', async() => {
        const res = await request(app).get('/account')
            .expect(200);

        expect(res.body.success).toBeFalsy();
    });

    test('get account info', async() => {
        const res = await request(app).get('/account')
            .set('Cookie', `sid=${sid}`)
            .expect(200);

        expect(res.body.success).toBeTruthy();
        expect(res.body.password).toBeUndefined();
        expect(res.body.username).toBe(username);
    });

    test('update account username fail', async() => {
        const res = await request(app).put('/account')
            .set('Cookie', `sid=${sid}`)
            .send({
                username: 'q',
            })
            .expect(200);

        expect(res.body.success).toBeFalsy();
        expect(res.body.errors).toContain('username.tooshort');
    });

    test('update account username', async() => {
        const res = await request(app).put('/account')
            .set('Cookie', `sid=${sid}`)
            .send({
                username: username_new,
            })
            .expect(200);

        expect(res.body.success).toBeTruthy();

        const user = await db.Users.findOne({where: {username: username_new}});
        expect(user.get().username).toBe(username_new);
    });

    test('update account password fail', async() => {
        const res = await request(app).put('/account')
            .set('Cookie', `sid=${sid}`)
            .send({
                password: 'wrong',
                password_new,
            })
            .expect(200);

        expect(res.body.success).toBeFalsy();
    });

    test('update account password', async() => {
        const res = await request(app).put('/account')
            .set('Cookie', `sid=${sid}`)
            .send({
                password,
                password_new,
            })
            .expect(200);

        expect(res.body.success).toBeTruthy();

        const user = await db.Users.findOne({where: {username: username_new}});
        expect(await user.matchPassword(password_new, options)).toBeTruthy();
        expect(send).toBeCalledTimes(1);
    });

    test('logout', async() => {
        const res = await request(app).post('/account/logout')
            .expect(200);

        expect(res.body.success).toBeTruthy();
        expect(res.body.logout).toBeFalsy();
    });

    test('logout', async() => {
        const res = await request(app).post('/account/logout')
            .set('Cookie', `sid=${sid}`)
            .expect(200);

        expect(res.body.success).toBeTruthy();
        expect(res.body.logout).toBeTruthy();
    });

    test('check db token', async() => {
        const user = await db.Users.findOne({where: {username: username_new}});
        const tokens = await user.getTokens();

        expect(tokens.length).toBe(1);
    });
});

function parseCookies(cookies) {
    const result = new Map();

    for (const cookie of cookies) {
        const parts = cookie.split('; ');
        const first = parts.shift().split('=');

        const content = {
            value: first[1],
        };

        for (let part of parts) {
            if (part.includes('=')) {
                const values = part.split('=');
                content[values[0]] = values[1];
            } else {
                content[part] = true;
            }    
        }

        result.set(first[0], content);
    }

    return result;
}
