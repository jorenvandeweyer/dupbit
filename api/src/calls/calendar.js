const express = require('express');
const db = require('../database');
const ICS = require('../../scripts/calendarICS');

module.exports = express.Router()
    .use(async (req, res, next) => {
        if (!req.auth)
            return res.errors.needAuth();

        next();
    })
    .get('/', async (req, res) => {
        const calendars = await db.Calendars.findAll({where: {uid: req.auth.uid}});
        res.jsons({
            calendars,
        });
    })
    .get('/:cal', async (req, res) => {
        try {
            const calendar = await db.Calendars.findOne({
                where: {uid: req.auth.uid, id: req.params.cal},
                include: [db.CalendarCourses, db.CalendarUrls]
            });
    
            if (!calendar) return res.errors.notFound();
    
            res.jsons({
                calendar,
            });
        } catch(e) {
            res.errors.db(e);
        }
    })
    .post('/', async (req, res) => {
        const data = req.body;

        try {
            const user = await req.auth.user();
            const calendar = await user.createCalendar({ name: data.name});
            return res.jsons({
                calendar,
            });
        } catch(e) {
            res.errors.db(e);
        }
    })
    .post('/:cal/url', async (req, res) => {
        try {
            const calendar = await db.Calendars.findOne({where: {uid: req.auth.uid, id: req.params.cal}});
            const url = await calendar.createCalendarUrl({
                name: req.body.name,
                value: req.body.value,
            });

            ICS.busy.reset();
            ICS.updateOne(calendar.get().id);

            res.jsons({
                url
            });
        } catch(e) {
            res.errors.db(e);
        }
    })
    .post('/:cal/course', async (req, res) => {
        try {
            const calendar = await db.Calendars.findOne({where: {uid: req.auth.uid, id: req.params.cal}});
            const course = await calendar.createCalendarCourse({
                name: req.body.name,
                value: req.body.value,
            });

            ICS.busy.reset();
            ICS.updateOne(calendar.get().id);

            res.jsons({
                course
            });
        } catch(e) {
            res.errors.db(e);
        }
    })
    .delete('/:cal', async (req, res) => {
        try {
            await db.Calendars.destroy({where: {uid: req.auth.uid, id: req.params.cal}});

            ICS.updateOne(req.params.cal);

            res.jsons();
        } catch(e) {
            res.errors.db(e);
        }
    })
    .delete('/:cal/url/:url', async (req, res) => {
        try {
            const calendar = await db.Calendars.findOne({where: {uid: req.auth.uid, id: req.params.cal}});
            await db.CalendarUrls.destroy({where: {calendarId: calendar.get().id, id: req.params.url}});
            
            ICS.updateOne(calendar.get().id);

            res.jsons();
        } catch(e) {
            console.log(e);
            res.errors.db(e);
        }
    })
    .delete('/:cal/course/:course', async (req, res) => {
        try {
            const calendar = await db.Calendars.findOne({where: {uid: req.auth.uid, id: req.params.cal}});
            await db.CalendarCourses.destroy({where: {calendarId: calendar.get().id, id: req.params.course}});

            ICS.updateOne(calendar.get().id);
            
            res.jsons();
        } catch(e) {
            console.log(e);
            res.errors.db(e);
        }
    });
