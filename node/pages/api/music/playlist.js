const express = require("express");
const db = require("../../../src/util/Database");

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

        if (data.playlist) {
            const songs = await db.getSongsSmart(data.playlist, req.auth.id);

            res.json({
                success: true,
                data: {
                    songs,
                },
            });
        } else {
            const playlists = await db.getPlaylistsOfSmart(req.auth.id);
            res.json({
                success: true,
                data: {
                    playlists,
                },
            });
        }

    })
    .post("*", ascyn (req, res) => {

    })
    .put("*", async (req, res) => {
        const data = req.body;

        if (data.name) {
            const result = await db.addPlaylist(data.name, req.auth.id);
            return res.json({
                success: true,
                data: {
                    id: result.insertId,
                    name: data.name,
                },
            });
        }

        res.status(405).json({
            success: false
        });
    })
    .delete("*", async (req, res) => {
        const data = req.body;

        if (data.pid) {
            const uid = await db.getUserOfPlaylist(data.pid);
            if (uid === req.auth.id) {
                await db.removePlaylist(data.pid);
                return res.json({
                    success: true,
                });
            }
        }

        res.status(405).json({
            success: false
        });
    });
