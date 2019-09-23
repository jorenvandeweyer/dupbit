const app = require('../../../api/src/index');
const request = require('supertest');

describe('testing non api call', () => {

    test('false get', (done) => {
        request(app).get('/jibberishsaaa')
            .expect(404)
            .then(res => {
                expect(res.body.success).toBe(false);
                done();
            });
    });

    test('false post', (done) => {
        request(app).post('/jibberisha')
            // .set('content-type', 'application/json')
            .expect(404)
            .then(res => {
                expect(res.body.success).toBe(false);
                done();
            });
    });
    
});
