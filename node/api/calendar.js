const express = require("express");
const db = require("../src/util/Database");

module.exports = express.Router()
    .all("*", (req, res, next) => {
        if (req.auth.isLoggedIn) {
            next();
        } else {
            res.status(401).json({
                success: false,
                reason: "need to be authenticated",
            });
        }
    })
    .get("*", async (req, res) => {
        const data = req.query;

        if (data.calendar) {
            const urls = await db.getCalendarUrls(req.auth.id, data.calendar);
            const courseNumbers = await db.getCalendarCourseNumbers(req.auth.id, data.calendar);
            res.json({
                success: true,
                data: {
                    urls,
                    courseNumbers,
                },
            });
        } else {
            const tables = await db.getCalendarTable(req.auth.id);
            res.json({
                success: true,
                data: {
                    tables,
                },
            });
        }
    })
    .post("*", async (req, res) => {
        const data = req.body;

        if (data.calendar) {
            if (data.info && data.data) {
                const result = await db.query("SELECT uid FROM calendar.calendars WHERE id = ?", [data.calendar]);
                if (result && result[0].uid === req.auth.id) {
                    const result = await db.query(`INSERT INTO calendar.${data.sort} (data, cid, name) VALUES (?, ?, ?)`, [data.data, data.calendar, data.info]);
                    return res.json({
                        success: true,
                        data: {
                            id: result.insertId,
                            data: data.data,
                            name: data.info,
                        },
                    });
                }
            }
        } else {
            if (data.name) {
                const result = await db.query("INSERT INTO calendar.calendars (uid, name) VALUES (?, ?)", [req.auth.id, data.name]);
                return res.json({
                    success: true,
                    data: {
                        id: result.insertId,
                        name: data.name,
                    },
                });
            }
        }

        res.status(405).json({
            success: false
        });
    })
    .delete("*", async (req, res) => {
        const data = req.body;
        if (data.sort && data.id) {
            const result = await db.query(`SELECT uid, ${data.sort}.id as sortId FROM calendar.calendars INNER JOIN calendar.${data.sort} ON calendars.id = ${data.sort}.cid WHERE ${data.sort}.id = ?`, [data.id]);
            if (result.length) {
                let id_check = result[0].uid;
                let deleteId = result[0].sortId;
                if (id_check === req.auth.id) {
                    await db.query(`DELETE FROM calendar.${data.sort} WHERE id = ?`, [deleteId]);
                    return res.json({
                        success: true,
                    });
                }
            }
        } else if (data.id) {
            const result = await db.query("SELECT uid, id FROM calendar.calendars WHERE id = ?", [data.id]);
            if (result.length && result[0].uid === req.auth.id) {
                await db.query("DELETE FROM calendar.calendars WHERE id = ?", [data.id]);
                return res.json({
                    success: true,
                });
            }
        }
        res.status(405).json({
            success: false
        });
    });
