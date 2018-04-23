const db = require("../src/util/Database");
const ical = require("ical");
const http = require("http");
const fs = require("fs");

class Calendar {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.header = "BEGIN:VCALENDAR\n"
            + "VERSION:2.0\n"
            + "PROID:-//uhasselt/lesroosters//NONSGML v1.0//EN\n"
            + "CALSCALE:GREGORIAN\n"
            + "METHOD:PUBLISH\n"
            + `X-WR-CALNAME:${this.name}\n`
            + "X-WR-TIMEZONE:Europe/Brussels\n"
            + "X-WR-CALDESC:\n"
            + "X-PUBLISHED-TTL:PT12H\n";
        this.footer = "END:VCALENDAR";
        this.events = {
            toString: function() {
                let raw = "";
                for (let e in this) {
                    if (typeof this[e] === "function") continue;
                    raw += this[e].toString();
                }
                return raw;
            }
        };
    }

    addEvent(e) {
        this.events[e.uid] = e;
    }

    filterEvents(calendar, filter) {
        for (let e in calendar) {
            let ev = calendar[e];
            for (let i = 0; i < filter.length; i++) {
                if ( (ev.summary && (ev.summary.includes(filter[i].name) || ev.summary.includes(filter[i].data)))
                    || (ev.description && (ev.description.includes(filter[i].name) || ev.summary.includes(filter[i].data)))) {
                    this.addEvent(new Event(ev));
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
}

class Event {
    constructor(start, end, sequence, summary, uid, stamp, _class) {
        if (typeof start === "object") {
            Object.assign(this, start);
        } else {
            this.start = start;
            this.end = end;
            this.sequence = sequence;
            this.summary = summary;
            this.uid = uid;
            this.stamp = stamp;
            this.class = _class;
        }
    }

    toString() {
        return "BEGIN:VEVENT\n"
            + `DTSTART:${this.start}\n`
            + `DTEND:${this.end}\n`
            + `SEQUENCE:${this.sequence}\n`
            + `SUMMARY:${this.summary}\n`
            + `DESCRIPTION:${this.description}\n`
            + `UID:${this.uid}\n`
            + `DTSTAMP:${this.stamp}\n`
            + `CLASS:${this.class}\n`
            + "END:VEVENT\n";
    }
}

async function main() {
    let calendars = await db.query("SELECT * FROM calendar.calendars");

    for (let i = 0; i < calendars.length; i++) {
        await createCalendar(calendars[i]);
    }
}

async function createCalendar(calendar) {
    let urls = await db.getCalendarUrls(calendar.uid, calendar.id);
    let courses = await db.getCalendarCourseNumbers(calendar.uid, calendar.id);

    let cal = new Calendar(calendar.name, calendar.id);

    for (let i = 0; i < urls.length; i++) {
        try {
            let file = await fetchFile(urls[i].data);
            file = ical.parseICS(file);

            cal.filterEvents(file, courses);
        } catch(e) {
            console.log(e);
        }
    }
    saveFile(cal);
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
                error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
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

function saveFile(calendar, path="../pages/ics") {
    if (!fs.existsSync("../pages/ics")){
        fs.mkdirSync("../pages/ics");
    }
    fs.writeFileSync(`${path}/calendar_${calendar.id}.ics`, calendar.toString());

}

if (require.main === module) {
    main();
}

module.exports = {
    update: function() {
        main();
    }
}
