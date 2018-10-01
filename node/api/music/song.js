const express = require("express");
const db = require("../../src/util/Database");
const Music = require("../../src/music/index");

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
            const song = await db.getSong(data.id);
            if (song.uid === req.auth.uid) {
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
            const songs = await db.getSongsOf(req.auth.uid);
            const playlistInfo = await db.getSongsInPlaylistsOf(req.auth.uid);
            res.json({
                success: true,
                songs,
                playlistInfo,
            });
        }
    })
    .post("*", async (req, res) => {
        const data = req.body;

        if (data.sid) {
            const uid = await db.getUserOfSong(data.sid);
            if (uid === req.auth.uid) {
                if (data.sid && data.artist && data.title && data.pids) {
                    await db.setArtist(data.sid, data.artist);
                    await db.setTitle(data.sid, data.title);

                    const playlists = await db.getPlaylistsOf(req.auth.uid);

                    for (let i = 0; i < playlists.length; i++) {
                        await db.removeSongFromPlaylist(data.sid, playlists[i].id);
                    }

                    for (let i = 0; i < data.pids.length; i++) {
                        await db.addSongToPlaylist(data.sid, data.pids[i]);
                    }

                    return res.json({
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

        }

        res.status(405).json({
            success: false
        });
    })
    .put("*", async (req, res) => {
        res.status(405).json({
            success: false,
            reason: "use /api/music/convert end point",
        });
    })
    .delete("*", async (req, res) => {
        const data = req.body;

        if (data.sid) {
            const uid = await db.getUserOfSong(data.sid);
            if (uid === req.auth.uid) {
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
