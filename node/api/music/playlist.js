const express = require("express");
const db = require("../../src/util/Database");

module.exports = express.Router()
    .all("*", (req, res, next) => {
        if (req.auth.isLoggedIn && req.auth.level >= 2) {
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

        if (data.id) {
            const songs = await db.getSongsSmart(data.id, req.auth.id);

            res.json({
                success: true,
                songs,
            });
        } else {
            const playlists = await db.getPlaylistsOfSmart(req.auth.id);
            res.json({
                success: true,
                playlists,
            });
        }

    })
    .post("*", async (req, res) => {
        const data = req.body;

        if (data.id && data.name) {
            const uid = await db.getUserOfPlaylist(data.id);
            if (uid === req.auth.id) {
                await db.setNamePlaylist(data.id, data.name);
                return res.json({
                    success: true,
                });
            }
        }

        res.status(405).json({
            success: false,
        });
    })
    .put("*", async (req, res) => {
        const data = req.body;

        if (data.name) {
            const result = await db.addPlaylist(req.auth.id, data.name);
            return res.json({
                success: true,
                data: {
                    id: result.insertId,
                    name: data.name,
                    numberOfSongs: 0,
                },
            });
        }

        res.status(405).json({
            success: false
        });
    })
    .delete("*", async (req, res) => {
        const data = req.body;

        if (data.id) {
            const uid = await db.getUserOfPlaylist(data.id);
            if (uid === req.auth.id) {
                await db.removePlaylist(data.id);
                return res.json({
                    success: true,
                });
            }
        }

        res.status(405).json({
            success: false
        });
    });
