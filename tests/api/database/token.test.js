const crypto = require('crypto');
const db = require('../../../api/src/database');

describe('testing database token', () => {
    const username = crypto.randomBytes(8).toString('hex');
    const password = crypto.randomBytes(8).toString('hex');

    beforeAll(async () => {
        await db.Users.create({
            username,
            password,
            email: `${username}@dupbit.com`,
        }, {
            req: {
                ip: '0.0.0.0',
            },
        });
    });

    afterAll(async () => {
        const user = await db.Users.findOne({where: {username}});
        await user.destroy();
    });

    test('create token', async () => {
        const user = await db.Users.findOne({where: {username}});
        const token = await user.createToken();

        expect(token.get().userId).toBe(user.get().id);
    });
});
