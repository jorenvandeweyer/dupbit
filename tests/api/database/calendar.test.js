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

    test('create calendar', async () => {
        const user = await db.Users.findOne({where: {username}});
        await user.createCalendar({
            name: 'test calendar',
        });

        const cal = await getCalendar();

        expect(cal.get().uid).toBe(user.get().id);
        expect(cal.get().name).toBe('test calendar');
    });

    test('create courses and urls', async () => {
        const cal = await getCalendar();
        await cal.createCalendarCourse({
            name: 'course1',
            value: 'value',
        });
        await cal.createCalendarUrl({
            name: 'url1',
            value: 'urll',
        });

        const courses = await cal.getCalendarCourses();
        const urls = await cal.getCalendarUrls();

        expect(courses[0].get().name).toBe('course1');
        expect(courses[0].get().value).toBe('value');
        expect(urls[0].get().name).toBe('url1');
        expect(urls[0].get().value).toBe('urll');
    });

    test('delete calendar', async() => {
        const cal = await getCalendar();
        await cal.destroy();
        const calcheck = await getCalendar();
        expect(calcheck).toBeUndefined();
    });

    async function getCalendar() {
        const user = await db.Users.findOne({where: {username}});
        const calendar = (await user.getCalendars())[0];
        return calendar;
    }
});
