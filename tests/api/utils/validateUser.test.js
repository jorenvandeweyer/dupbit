const validate = require('../../../api/src/utils/validateUser');
const db = require('../../../api/src/database');
const crypto = require('crypto');

describe('testing user validation', () => {
    const username = crypto.randomBytes(8).toString('hex');
    const username2 = crypto.randomBytes(8).toString('hex');
    const password = crypto.randomBytes(8).toString('hex');

    beforeAll(async () => {
        await db.Users.create({
            username: username2,
            password,
            email: `${username2}@dupbit.com`,
        }, {
            req: {
                ip: '0.0.0.0',
            },
        });
    });

    afterAll(async () => {
        const user = await db.Users.findOne({where: {username: username2}});
        await user.destroy();
    });

    afterEach(async () => {
        await db.Logs.destroy({where: {[db.Op.or]: [{username}, {username: username2}]}});
    });

    test('valid username', async () => {
        const errorCode = await validate.username(username);
        expect(errorCode).toBe(0);
    });

    test('used username', async () => {
        const errorCode = await validate.username(username2);
        expect(errorCode).not.toBe(0);

        const errors = validate.getErrorMessage(errorCode);
        expect(errors).toContain('username.used');
    });

    test('short username', async () => {
        const errorCode = await validate.username('so');
        expect(errorCode).not.toBe(0);

        const errors = validate.getErrorMessage(errorCode);
        expect(errors).toContain('username.tooshort');
    });

    test('long username', async () => {
        const errorCode = await validate.username('thisisfartoolongforausername');
        expect(errorCode).not.toBe(0);

        const errors = validate.getErrorMessage(errorCode);
        expect(errors).toContain('username.toolong');
    });

    test('illegal username', async () => {
        const errorCode = await validate.username('no spaces');
        expect(errorCode).not.toBe(0);

        const errors = validate.getErrorMessage(errorCode);
        expect(errors).toContain('username.invalidchars');
    });

    test('change username', async () => {
        const errorCode = await validate.username(username, username);
        expect(errorCode).not.toBe(0);

        const errors = validate.getErrorMessage(errorCode);
        expect(errors).toContain('username.same');
    });
});

describe('testing password validation', () => {
    test('valid password', () => {
        const errorCode = validate.password('goodpassword123');
        expect(errorCode).toBe(0);
    });

    test('short password', () => {
        const errorCode = validate.password('short');
        expect(errorCode).not.toBe(0);
        const errors = validate.getErrorMessage(errorCode);
        expect(errors).toContain('password.tooshort');
    });

    test('long password', () => {
        const errorCode = validate.password('longpasswordareactualgoodthingswhyamidoingthis?');
        expect(errorCode).not.toBe(0);
        const errors = validate.getErrorMessage(errorCode);
        expect(errors).toContain('password.toolong');
    });

    test('illegal password', () => {
        const errorCode = validate.password('this has spacesù');
        expect(errorCode).not.toBe(0);
        const errors = validate.getErrorMessage(errorCode);
        expect(errors).toContain('password.invalidchars');
    });

    test('no match password', () => {
        const errorCode = validate.password('password','passssword');
        expect(errorCode).not.toBe(0);
        const errors = validate.getErrorMessage(errorCode);
        expect(errors).toContain('password.nomatch');
    });
});

describe('testing email validation', () => {
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

    test('valid email', async () => {
        const errorCode = await validate.email('hithisisme@dupbit.com');
        expect(errorCode).toBe(0);
    });

    test('invalid email', async () => {
        const errorCode = await validate.email('hithisismedupbit.com');
        expect(errorCode).not.toBe(0);
        const errors = validate.getErrorMessage(errorCode);
        expect(errors).toContain('email.format');
    });

    test('email used', async () => {
        const errorCode = await validate.email(`${username}@dupbit.com`);
        expect(errorCode).not.toBe(0);
        const errors = validate.getErrorMessage(errorCode);
        expect(errors).toContain('email.used');
    });
});
