const db = require("../../src/util/Database");

async function resolve(data, apidata) {
    if (data.action && apidata.session.isLoggedIn) {
        switch (data.action) {
            case "deleteCalendar":
                if (data.id) {
                    let result = await db.query("SELECT uid, id FROM calendar.calendars WHERE id = ?", [data.id]);
                    if (result.length && result[0].uid === apidata.session.id) {
                        db.query("DELETE FROM calendar.calendars WHERE id = ?", [data.id]);
                    }
                    return {
                        success: true,
                        backdirect: true,
                        data: {
                            deleted: undefined,
                        },
                    };
                }
                break;
            case "createCalendar":
                if (data.name) {
                    await db.query("INSERT INTO calendar.calendars (uid, name) VALUES (?, ?)", [apidata.session.id, data.name]);
                    return {
                        success: true,
                        backdirect: true,
                        data: {
                            created: undefined,
                        },
                    };
                }
                break;
            case "deleteCalendarData":
                if (data.sort && data.id) {
                    let result = await db.query(`SELECT uid, ${data.sort}.id as sortId FROM calendar.calendars INNER JOIN calendar.${data.sort} ON calendars.id = ${data.sort}.cid WHERE ${data.sort}.id = ?`, [data.id]);
                    if (result.length) {
                        let id_check = result[0].uid;
                        let deleteId = result[0].sortId;
                        if (id_check === apidata.session.id) {
                            await db.query(`DELETE FROM calendar.${data.sort} WHERE id = ?`, [deleteId]);
                            return {
                                success: true,
                                backdirect: true,
                                data: {
                                    deleted: undefined,
                                },
                            };
                        }
                    }
                }
                break;
            case "createCalendarData":
                if (data.info && data.data && data.calendar) {
                    let result = await db.query("SELECT uid FROM calendar.calendars WHERE id = ?", [data.calendar]);
                    if (result && result[0].uid ===  apidata.session.id) {
                        await db.query(`INSERT INTO calendar.${data.sort} (data, cid, name) VALUES (?, ?, ?)`, [data.data, data.calendar, data.info]);
                        return {
                            success: true,
                            backdirect: true,
                            data: {
                                updated: undefined,
                            },
                        };
                    }
                }
                break;
            default:
        }
    }

    return {
        success: false,
        backdirect: true,
    };
}

module.exports = {
    resolve
};
