const request = require('supertest');
const app = require('../../../../api/src/index');

const {createUser, destroyUser} = require('../../../test-utils/user');


describe('testing calendars', () => {
    let admin, user;

    beforeAll(async () => {
        admin = await createUser('EMAIL.VALID', 'ADMIN');
        user = await createUser('EMAIL.VALID', 'ADMIN');

    });

    afterAll(async () => {
        await destroyUser(user);
        await destroyUser(admin);
    });

    test('get all users', async () => {
        const result = await request(app).get('/admin/users')
            .set('Cookie', `sid=${admin.sid}`)
            .expect(200);

        expect(result.body.success).toBeTruthy();
        expect(result.body.users.length).toBe(2);
    });

    test('update a user', async () => {
        const result = await request(app).put('/admin/users')
            .set('Cookie', `sid=${admin.sid}`)
            .send({
                id: user.user.get().id,
                username: user.user.get().username,
                email: user.user.get().email,
                permissions: 0,
            })
            .expect(200);

        expect(result.body.success).toBeTruthy();
        expect(result.body.user.permissions).toEqual([]); 
    });

    test('delete a user', async () => {
        const result = await request(app).delete(`/admin/users/${user.user.get().id}`)
            .set('Cookie', `sid=${admin.sid}`)
            .expect(200);

        expect(result.body.success).toBeTruthy();

        const result2 = await request(app).get('/admin/users')
            .set('Cookie', `sid=${admin.sid}`)
            .expect(200);
        expect(result2.body.users.length).toBe(1);
    });

});
