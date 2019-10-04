const db = require('../src/database');
const ical = require('ical');
const http = require('http');
const fs = require('fs').promises;

class Calendar {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.header = 'BEGIN:VCALENDAR\n'
            + 'VERSION:2.0\n'
            + 'PROID:-//uhasselt/lesroosters//NONSGML v1.0//EN\n'
            + 'CALSCALE:GREGORIAN\n'
            + 'METHOD:PUBLISH\n'
            + `X-WR-CALNAME:${this.name}\n`
            + 'X-WR-TIMEZONE:Europe/Brussels\n'
            + 'X-WR-CALDESC:\n'
            + 'X-PUBLISHED-TTL:PT12H\n';
        this.footer = 'END:VCALENDAR';
        this.events = {
            toString: function() {
                let raw = '';
                for (let event in this) {
                    if (typeof this[event] === 'function') continue;
                    raw += this[event].toString();
                }
                return raw;
            }
        };
    }

    addEvent(event) {
        this.events[event.uid] = event;
    }

    filterEvents(calendar, filters) {
        for (let e in calendar) {
            const event = calendar[e];
            for (let filter of filters) {
                const is_valid = obj => obj &&
                    (obj.includes(filter.get().name) || obj.includes(filter.get().value));
                if (is_valid(event.summary) || is_valid(event.description)) {
                    this.addEvent(new Event(event));
                    break;
                }
            }
        }
    }

    toString() {
        return this.header
            + this.events.toString()
            + this.footer;
    }

    async save() {
        const path = __dirname + '/' + process.env.FILES_PATH + '/ics';
        const s = await fs.stat(path).catch(() => null);
        if (!s || !s.isDirectory()) {
            await fs.mkdir(path);
        }
        await fs.writeFile(`${path}/calendar_${this.id}.ics`, this.toString());
    }

    static async remove(id) {
        const path = __dirname + '/' + process.env.FILES_PATH + '/ics';
        await fs.unlink(`${path}/calendar_${id}.ics`).catch((e) => console.log(e));
    } 
}

class Event {
    constructor(event) {
        Object.assign(this, event);
    }

    toString() {
        return 'BEGIN:VEVENT\n'
            + `DTSTART:${formatDate(this.start)}\n`
            + `DTEND:${formatDate(this.end)}\n`
            + ((this.sequence) ? `SEQUENCE:${this.sequence}\n` : '')
            + `SUMMARY:${this.summary}\n`
            + `DESCRIPTION:${this.description}\n`
            + `UID:${this.uid}\n`
            + `DTSTAMP:${this.dtstamp}\n`
            + ((this.class) ? `CLASS:${this.class}\n` : '')
            + ((this.location) ? `LOCATION:${this.location}\n` : '')
            + 'END:VEVENT\n';
    }
}

function formatDate(date) {
    return date.toISOString()
        .replace('.000Z', 'Z')
        .replace(/-/g, '')
        .replace(/:/g, '');
}

async function main() {
    const calenders = await db.Calendars.findAll();
    for (const calendar of calenders) {
        await createCalendar(calendar);
    }
    await busy.resolve();
}

async function updateOne(id) {
    const calendar = await db.Calendars.findOne({where: {id}});
    if (calendar) await createCalendar(calendar);
    else await Calendar.remove(id);
    await busy.resolve();
}

async function createCalendar(calendar) {
    const cal = new Calendar(calendar.get().name, calendar.get().id);
    const urls = await calendar.getCalendarUrls();
    const courses = await calendar.getCalendarCourses();

    for (const url of urls) {
        try {
            let file = await fetchFile(url.get().value);
            file = ical.parseICS(file);
            cal.filterEvents(file, courses);
        } catch(e) {
            console.log('calendarscript error:', e);
        }
    }

    return cal.save();
}

function fetchFile(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];
            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
            } else if (!/^text\/calendar/.test(contentType)) {
                error = new Error('Invalid content-type.\n' + `Expected text/calendar but received ${contentType}`);
            }
            if (error) {
                reject(error.message);
                res.resume();
                return;
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    resolve(rawData);
                } catch (e) {
                    reject(e.message);
                }
            });
        }).on('error', (e) => {
            reject(`Got error: ${e.message}`);
        });
    });
}

if (require.main === module) {
    main();
}

class Busy {
    constructor() {
        this.r;
        this.p;
        this.reset();
    }

    reset() {
        this.p = new Promise((resolve) => this.r = resolve);
    }

    async resolve() {
        await this.r();
    }
}

const busy = new Busy();

module.exports = {
    update: main,
    updateOne,
    busy,
};
