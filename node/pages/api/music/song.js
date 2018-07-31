const express = require("express");
const db = require("../../../src/util/Database");
const Music = require("../../../src/music/index");

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
            const song = await db.getConvert(data.id);
            if (song.uid === req.auth.id) {
                if ("download" in data) {
                    const download = await Music.download(song);
                    res.set("Content-disposition", `attachment; filename=${download.name}.mp3`);
                    res.set("Content-Type", "audio/mpeg");
                    res.send(download.file);
                } else {
                    res.json({
                        success: true,
                        song,
                    });
                }
            } else {
                res.status(405).json({
                    success: false,
                    reason: "song does not exists",
                });
            }
        } else {
            const songs = await db.getSongsSmart(null, req.auth.id);
            res.json({
                success: true,
                songs,
            });
        }
    })
    .post("*", async (req, res) => {
        const data = req.body;

        if (data.sid) {
            const uid = await db.getUserOfSong(data.sid);
            if (uid === req.auth.id) {
                if (data.artist) {
                    await db.setArtist(data.sid, data.artist);
                }

                if (data.title) {
                    await db.setTitle(data.sid, data.title);
                }

                if (data.pid) {
                    const playlists = await db.getPlaylistsOf(req.auth.id);

                    for (let i = 0; i < playlists.length; i++) {
                        await db.removeSongFromPlaylist(data.sid, playlists[i].id);
                    }
                    if (typeof data.pid === "object") {
                        for (let i = 0; i < data.pid.length; i++) {
                            await db.addSongToPlaylist(data.sid, data.pid[i]);
                        }
                    } else {
                        await db.addSongToPlaylist(data.sid, data.pid);
                    }

                }
                res.json({
                    success: true,
                    data: {
                        sid: data.sid,
                        artist: data.artist,
                        title: data.title,
                        pid: data.pid,
                    },
                });
            }

        }

        res.status(405).json({
            success: false
        });
    })
    .put("*", async (req, res) => {
        const data = req.body;

        if (data.url && data.title && data.artist) {
            let result;

            if (data.url.includes("youtube.com/watch?v=")) {
                result = await db.addSong(data.url.split("watch?v=")[1].split("&list")[0], data.title, data.artist, data.uid);
            } else {
                result = await db.addSong(data.url, data.title, data.artist, data.uid);
            }

            return res.json({
                success: true,
                data: {
                    id: result.insertId,
                    url: data.url,
                    title: data.title,
                    artist: data.artist,
                },
            });
        }

        res.status(405).json({
            success: false
        });
    })
    .delete("*", async (req, res) => {
        const data = req.body;

        if (data.sid) {
            const uid = await db.getUserOfSong(data.sid);
            if (uid === req.auth.id) {
                await db.removeSong(data.sid);
                return res.json({
                    success: true,
                });
            }
        }

        res.status(405).json({
            success: false
        });
    });
