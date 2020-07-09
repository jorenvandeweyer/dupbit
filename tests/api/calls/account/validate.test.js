const request = require('supertest');
const app = require('../../../../api/src/index');
const crypto = require('crypto');

describe('testing account recovery', () => {
    const username = crypto.randomBytes(8).toString('hex');
    const password = crypto.randomBytes(8).toString('hex');
    
    test('normal validate', async () => {
        const res = await request(app).post('/account/validate')
            .set('Content-Type', 'application/json')
            .send({
                username,
                password,
                confirmpassword: password,
                email: `${username}@dupbit.com`,
            })
            .expect(200);

        expect(res.body.success).toBeTruthy();
        expect(res.body).toEqual({
            success: true,
            username: [],
            password: [],
            confirmpassword: [],
            email: [],
        });
    });

    test('fail validate', async () => {
        const res = await request(app).post('/account/validate')
            .set('Content-Type', 'application/json')
            .send({
                username: 'q',
                password: 's',
                confirmpassword: 'dd',
                email: `${username}@dupb`,
            })
            .expect(200);

        expect(res.body.success).toBeTruthy();
        expect(res.body).toEqual({
            success: true,
            username: ['username.tooshort'],
            password: ['password.tooshort'],
            confirmpassword: ['password.tooshort', 'password.nomatch'],
            email: ['email.format'],
        });
    });


});
