const db = require("../../../src/util/Database");

async function resolve(data, apidata) {
    if (data.sid && apidata.session.isLoggedIn && apidata.session.level >= 2) {
        const uid = await db.getUserOfSong(data.sid);
        if (uid === apidata.session.id) {
            if (data.artist) {
                await db.setArtist(data.sid, data.artist);
            }

            if (data.title) {
                await db.setTitle(data.sid, data.title);
            }

            if (data.pid) {
                const playlists = await db.getPlaylistsOf(apidata.session.id);

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
            return {
                success: true,
                backdirect: true,
            };
        }
    }
    return {
        success: false,
    };
}

module.exports = {
    resolve,
};
