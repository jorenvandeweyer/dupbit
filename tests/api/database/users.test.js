const crypto = require('crypto');
const db = require('../../../api/src/database');

const options = {
    req: {
        ip: '0.0.0.0',
    },
};

describe('testing database user', () => {
    const username = crypto.randomBytes(8).toString('hex');
    const username2 = crypto.randomBytes(8).toString('hex');
    const password = crypto.randomBytes(8).toString('hex');
    
    afterEach(async () => {
        await db.Logs.destroy({where: {[db.Op.or]: [{username}, {username: username2}]}});
    });

    test('create user', async () => {
        const user = await db.Users.create({
            username,
            password,
            email: `${username}@dupbit.com`,
        }, options);

        const logs = await user.getLogs();

        expect(logs.length).toBe(3);
        expect(user.get().username).toBe(username);
    });

    test('get user', async () => {
        const user = await db.Users.findOne({where: {username}});

        expect(user.get().username).toBe(username);
    });
    
    test('update user', async () => {
        const user = await db.Users.findOne({where: {username}});

        await user.update({
            email: `${username}@email.com`,
        }, options);

        const updated = await db.Users.findOne({where: {username}});
        const logs = await updated.getLogs();

        expect(logs.length).toBe(1);
        expect(updated.get().email).toBe(`${username}@email.com`);
    });

    test('check password user', async() => {
        const user = await db.Users.findOne({where: {username}});

        expect(await user.matchPassword('randomstring', options)).toBe(false);
        expect(await user.matchPassword(password, options)).toBe(true);

        const logs = await user.getLogs();
        expect(logs.length).toBe(2);
    });

    test('change password user', async() => {
        const user = await db.Users.findOne({where: {username}});
        
        const newPassword = crypto.randomBytes(8).toString('hex');

        await user.update({
            password: newPassword,
        }, options);

        const updated = await db.Users.findOne({where: {username}});
        const logs = await updated.getLogs();

        expect(updated.get().password).not.toBe(newPassword);
        expect(await updated.matchPassword(newPassword, options)).toBe(true);
        expect(await updated.matchPassword(password, options)).toBe(false);
        expect(logs.length).toBe(1);
    });

    test('log loginattempt', async () => {
        const result = await db.Logs.create({
            action: 'LOGIN_ATTEMPT',
            username: username2,
            ip: '0.0.0.1',
            metadata: {
                success: false,
            }
        });

        const logs = await db.Logs.findAll({where: {username: username2}});

        expect(logs.length).toBe(1);
        expect(result.get().metadata.success).toBe(false);
    });

    test('destroy login attempt', async() => {
        await db.Logs.create({
            action: 'LOGIN_ATTEMPT',
            username: username2,
            ip: '0.0.0.1',
            metadata: {
                success: false,
            }
        });

        const attempt = await db.Logs.findOne({where: {username: username2}});

        await attempt.destroy();

        const result = await db.Logs.findOne({where: {username: username2}});

        expect(result).toBeNull();
    });

    test('destroy user', async() => {
        const user = await db.Users.findOne({where: {username}});

        await user.destroy();

        const result = await db.Users.findOne({where: {username}});
        const result2 = await db.Logs.findOne({where: {username}});

        expect(result).toBeNull();
        expect(result2).toBeNull();
    });


});
