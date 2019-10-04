const request = require('supertest');
const app = require('../../../api/src/index');
const ICS = require('../../../api/scripts/calendarICS');

const {createUser, destroyUser} = require('../../test-utils/user');


describe('testing calendars', () => {
    let user;
    let calendar, course, url;

    beforeAll(async () => {
        user = await createUser('EMAIL.VALID');
    });

    afterAll(async () => {
        await destroyUser(user);
    });

    test('create calendar', async () => {
        const res = await request(app).post('/calendar')
            .set('Cookie', `sid=${user.sid}`)
            .send({
                name: 'test-calendar',
            })
            .expect(200);

        expect(res.body.success).toBeTruthy();
        expect(res.body.calendar.name).toBe('test-calendar');

        calendar = res.body.calendar;
    });

    test('create url', async () => {
        const res = await request(app).post(`/calendar/${calendar.id}/url`)
            .set('Cookie', `sid=${user.sid}`)
            .send({
                name: 'ma ea-ict',
                value: 'http://collegeroosters.uhasselt.be/1640_2019_2020.ics'
            })
            .expect(200);

        expect(res.body.success).toBeTruthy();
        expect(res.body.url.value).toBe('http://collegeroosters.uhasselt.be/1640_2019_2020.ics');
        
        url = res.body.url;
        await ICS.busy.p;
    });

    test('create course', async () => {
        const res = await request(app).post(`/calendar/${calendar.id}/course`)
            .set('Cookie', `sid=${user.sid}`)
            .send({
                name: '2884',
                value: 'DSPIM'
            })
            .expect(200);

        expect(res.body.success).toBeTruthy();
        expect(res.body.course.value).toBe('DSPIM');
        
        course = res.body.course;
        await ICS.busy.p;
    });

    test('delete course', async () => {
        const res = await request(app).delete(`/calendar/${calendar.id}/course/${course.id}`)
            .set('Cookie', `sid=${user.sid}`)
            .expect(200);

        expect(res.body.success).toBeTruthy();
        await ICS.busy.p;
    });

    test('delete url', async () => {
        const res = await request(app).delete(`/calendar/${calendar.id}/url/${url.id}`)
            .set('Cookie', `sid=${user.sid}`)
            .expect(200);

        expect(res.body.success).toBeTruthy();
        await ICS.busy.p;
    });

    test('check if actually deleted', async () => {
        const res = await request(app).get(`/calendar/${calendar.id}`)
            .set('Cookie', `sid=${user.sid}`)
            .expect(200);

        expect(res.body.success).toBeTruthy();
        expect(res.body.calendar.calendarUrls.length).toBe(0);
        expect(res.body.calendar.calendarCourses.length).toBe(0);
    });

    test('delete calendar', async () => {
        const res = await request(app).delete(`/calendar/${calendar.id}`)
            .set('Cookie', `sid=${user.sid}`)
            .expect(200);

        expect(res.body.success).toBeTruthy();

        const result = await request(app).get('/calendar')
            .set('Cookie', `sid=${user.sid}`)
            .expect(200);

        expect(result.body.success).toBeTruthy();
        expect(result.body.calendars.length).toBe(0);
    });

});
