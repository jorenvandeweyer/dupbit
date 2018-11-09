const mysql = require("mysql");
const settings = require("../../config.json");

const pool = mysql.createPool({
    host: settings.MYSQL_HOST,
    user: settings.MYSQL_USER,
    password: settings.MYSQL_PASSWORD,
    database: settings.MYSQL_DATABASE
});

checkTables();
// con.connect((err) => {
//     if(err) {
//         throw err;
//     }
// });

async function checkTables() {
    await query("CREATE DATABASE IF NOT EXISTS users;").then((result) => {
        if (result.warningCount == 0) {
            console.log("Created Database \"users\".");
        }
    });
    await query("CREATE DATABASE IF NOT EXISTS music;").then((result) => {
        if (result.warningCount == 0) {
            console.log("Created Database \"music\".");
        }
    });
    await query("CREATE DATABASE IF NOT EXISTS calendar").then((result) => {
        if (result.warningCOunt == 0) {
            console.log("Created Database \"calendar\".");
        }
    });

    await query(`CREATE TABLE IF NOT EXISTS users.users (
        id INT NOT NULL UNIQUE AUTO_INCREMENT,
        username VARCHAR(20) NOT NULL UNIQUE,
        password CHAR(60) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        level INT DEFAULT 0,
        registrationTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    )`).then((result) => {
        if (result.warningCount == 0) {
            console.log("Created table \"users.users\".");
        }
    });

    await query(`CREATE TABLE IF NOT EXISTS users.loginAttempts (
		username VARCHAR(20) NOT NULL,
		uid INT,
		ip CHAR(40),
		timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		success BOOLEAN NOT NULL,
		FOREIGN KEY (uid) REFERENCES users.users(id) ON DELETE CASCADE
    )`).then((result) => {
        if (result.warningCount == 0) {
            console.log("Created table \"users.loginAttempts\".");
        }
    });

    await query(`CREATE TABLE IF NOT EXISTS users.usernameChanges (
		uid INT NOT NULL,
		username VARCHAR(20) NOT NULL,
		timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (uid) REFERENCES users.users(id) ON DELETE CASCADE
    )`).then((result) => {
        if (result.warningCount == 0) {
            console.log("Created table \"users.usernameChanges\".");
        }
    });

    await query(`CREATE TABLE IF NOT EXISTS users.emailChanges (
        uid INT NOT NULL,
        email VARCHAR(255) NOT NULL,
		ip CHAR(40),
		timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uid) REFERENCES users.users(id) ON DELETE CASCADE
    )`).then((result) => {
        if (result.warningCount == 0) {
            console.log("Created table \"users.emailChanges\".");
        }
    });

    await query(`CREATE TABLE IF NOT EXISTS users.passwordChanges (
        uid INT NOT NULL,
		ip CHAR(40),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uid) REFERENCES  users.users(id) ON DELETE CASCADE
    )`).then((result) => {
        if (result.warningCount == 0) {
            console.log("CReated table \"users.passwordChanges\".");
        }
    });

    await query(`CREATE TABLE IF NOT EXISTS users.passwordForgot (
        id INT NOT NULL UNIQUE AUTO_INCREMENT,
        uid INT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        timestamp_completed TIMESTAMP,
        ip CHAR(40),
		ip_completed CHAR(40),        
        FOREIGN KEY (uid) REFERENCES users.users(id) ON DELETE CASCADE,
        PRIMARY KEY(id)
    )`).then((result) => {
        if (result.warningCount == 0) {
            console.log("Created table \"users.passwordForgot\".");
        }
    });

    await query(`CREATE TABLE IF NOT EXISTS users.tokens (
        tid INT NOT NULL UNIQUE AUTO_INCREMENT,
        uid INT NOT NULL,
        info JSON,
        app_type VARCHAR(32),
        ip CHAR(40),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uid) REFERENCES users.users(id)
            ON DELETE CASCADE
    )`).then((result) => {
        if (result.warningCount == 0) {
            console.log("Created table \"users.tokens\".");
        }
    });

    await query(`CREATE TABLE IF NOT EXISTS users.token_identifier(
        tid INT NOT NULL UNIQUE,
        identifier VARCHAR(64),
        FOREIGN KEY (tid) REFERENCES users.tokens(tid)
            ON DELETE CASCADE
    )`).then((result) => {
        if (result.warningCount == 0) {
            console.log("Created table \"users.token_identifier\"");
        }
    });


    await query(`CREATE TABLE IF NOT EXISTS music.songs_raw (
        id INT NOT NULL UNIQUE AUTO_INCREMENT,
        filename VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL DEFAULT('UNKNOWN'),
        cached BOOLEAN NOT NULL DEFAULT 0,
        downloads INT NOT NULL DEFAULT 0,
        PRIMARY KEY (id)
    )`).then((result) => {
        if (result.warningCount == 0) {
            console.log("Created table \"music.songs_raw\".");
        }
    });

    await query(`CREATE TABLE IF NOT EXISTS music.songs (
        id INT NOT NULL UNIQUE AUTO_INCREMENT,
        srid INT NOT NULL,
        uid INT NOT NULL,
        title VARCHAR(255),
        artist VARCHAR(255),
        PRIMARY KEY (id),
        FOREIGN KEY (srid) REFERENCES music.songs_raw(id) ON DELETE CASCADE,
        FOREIGN KEY (uid) REFERENCES users.users(id) ON DELETE CASCADE
    )`).then((result) => {
        if (result.warningCount == 0) {
            console.log("Created table \"music.songs\".");
        }
    });

    await query(`CREATE TABLE IF NOT EXISTS music.playlists (
		id INT NOT NULL UNIQUE AUTO_INCREMENT,
		name VARCHAR(30) NOT NULL,
		uid INT NOT NULL,
		PRIMARY KEY (id),
		FOREIGN KEY (uid) REFERENCES users.users(id) ON DELETE CASCADE
    )`).then((result) => {
        if (result.warningCount == 0) {
            console.log("Created table \"music.playlists\".");
        }
    });

    await query(`CREATE TABLE IF NOT EXISTS music.songInPlaylist (
		sid INT NOT NULL,
		pid INT NOT NULL,
		FOREIGN KEY (sid) REFERENCES music.songs(id) ON DELETE CASCADE,
		FOREIGN KEY (pid) REFERENCES music.playlists(id) ON DELETE CASCADE
    )`).then((result) => {
        if (result.warningCount == 0) {
            console.log("Created table \"music.songInPlaylist\".");
        }
    });

    await query(`CREATE TABLE IF NOT EXISTS calendar.calendars (
        id INT NOT NULL UNIQUE AUTO_INCREMENT,
        name VARCHAR(64) NOT NULL,
        uid INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (uid) REFERENCES users.users(id)
            ON DELETE CASCADE
    )`).then((result) => {
        if (result.warningCount == 0) {
            console.log("Created table \"calendar.calendars\".");
        }
    });

    await query(`CREATE TABLE IF NOT EXISTS calendar.urls (
        id INT NOT NULL UNIQUE AUTO_INCREMENT,
        data VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        cid INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (cid) REFERENCES calendar.calendars(id)
            ON DELETE CASCADE
    )`).then((result) => {
        if (result.warningCount == 0) {
            console.log("Created table \"calendar.urls\".");
        }
    });

    await query(`CREATE TABLE IF NOT EXISTS calendar.courses (
        id INT NOT NULL UNIQUE AUTO_INCREMENT,
        data VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        cid INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (cid) REFERENCES calendar.calendars(id)
            ON DELETE CASCADE
    )`).then((result) => {
        if (result.warningCount == 0) {
            console.log("Created table \"calendar.courses\".");
        }
    });
}

function getConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) return reject(err);
            resolve(connection);
        });
    }).catch((err) => {
        console.log(err);
        return null;
    });
}

function query(query, options) {
    return new Promise(async (resolve, reject) => {
        let connection = await getConnection();
        connection.query(query, options, (err, result) => {
            connection.release();

            if (err) return reject(err);
            resolve(result);
        });
        // con.query(query, options, (err, result) => {
        //     if (err) return reject(err);
        //     resolve(result);
        // });
    }).catch((err) => {
        console.log(err);
        return null;
    });
}

// Register a user with the given username, password, email and level
async function register(username, password, email, level=0) {
    return await query("INSERT INTO users.users (username, password, email, level) VALUES (?, ?, ?, ?)", [username, password, email, level]);
}

async function unregister(id) {
    return await query("DELETE FROM users.users WHERE id=?", [id]);
}

// Check if the given username is registered
async function isRegistered(username) {
    let result = await query("SELECT username FROM users.users WHERE username=?", [username]);
    return result.length === 1;
}

// Check if the given email is in use
async function isInUse(email) {
    let result = await query("SELECT email FROM users.users WHERE email=?", [email]);
    return result.length === 1;
}

// Return the id of the user with given username
async function getIDByUsername(username) {
    let result = await query("SELECT id FROM users.users WHERE username=?", [username]);
    if (result.length) {
        return result[0].id;
    } else {
        return null;
    }
}

async function getIdByEmail(email) {
    let result = await query("SELECT id FROM users.users WHERE email=?", [email]);
    if (result.length) {
        return result[0].id;
    } else {
        return null;
    }
}

// Return the username of the user with given id
async function getUsernameByID(id) {
    let result = await query("SELECT username FROM users.users WHERE id=?", [id]);
    if (result.length) {
        return result[0].username;
    } else {
        return null;
    }
}

// Set the username of the user with the given id to the given username
async function setUsername(id, username) {
    return await query("UPDATE users.users SET username=? WHERE id=?", [username, id]);
}

// Return the password of the user with given id
async function getPasswordByID(id) {
    let result = await query("SELECT password FROM users.users WHERE id=?", [id]);
    if (result.length) {
        return result[0].password;
    } else {
        return null;
    }
}

// Set the password of the user with the given id to the given username
async function setPassword(id, password) {
    return await query("UPDATE users.users SET password=? WHERE id=?", [password, id]);
}

// Return the email of the user with given id
async function getEmailByID(id) {
    let result = await query("SELECT email FROM users.users WHERE id=?", [id]);
    if (result.length) {
        return result[0].email;
    } else {
        return null;
    }
}

// Set the email of the user with the given id to the given username
async function setEmail(id, email) {
    return await query("UPDATE users.users SET email=? WHERE id=?", [email, id]);
}

// Return the level of the user with given id
async function getLevelByID(id) {
    let result = await query("SELECT level FROM users.users WHERE id=?", [id]);
    if (result.length) {
        return result[0].level;
    } else {
        return null;
    }
}

// Get all users
async function getUsers() {
    return await query("SELECT * FROM users.users");
}

// Set the level of the user with the given id to the given level
async function setLevel(id, level) {
    return await query("UPDATE users.users SET level=? WHERE id=?", [level, id]);
}


// Add a token
async function addToken(uid, info, app_type, ip, name="unknown") {
    const result = await query("INSERT INTO users.tokens (uid, info, app_type, ip) VALUES (?, ?, ?, ?)", [uid, info, app_type, ip]);
    query("INSERT INTO users.token_identifier (tid, identifier) VALUES (?, ?)", [result.insertId, name]);
    return result;
}

// Get token
function getToken(tid) {
    return query("SELECT * FROM users.tokens WHERE tid=?", [tid]);
}

function getTokens(uid) {
    return query("SELECT * FROM users.tokens WHERE uid=?", [uid]);
}

async function getTokenSafe(token) {
    return await query("SELECT * FROM users.tokens WHERE uid=? AND tid=?", [token.uid, token.tid]);
}

// Remove a token
async function removeToken(tid) {
    return await query("DELETE FROM users.tokens WHERE tid=?", [tid]);
}

async function setTokenIdentifier(tid, identifier) {
    return await query("UPDATE users.token_identifier SET identifier=? WHERE tid=?", [identifier, tid]);
}

// Register the client's IP and the current timestamp of login attempt with the given username
async function addLoginAttempt(username, success, ip) {
    let id = await getIDByUsername(username);
    return await query("INSERT INTO users.loginAttempts (username, uid, ip, success) VALUES (?, ?, ?, ?)", [username, id, ip, success]);
}

// Register the client's IP and the current timestamp of login attempt with the given id
async function addLoginAttemptByID(id, success, ip) {
    let username = await getUsernameByID(id);
    return await query("INSERT INTO users.loginAttempts (username, uid, ip, success) VALUES (?, ?, ?, ?)", [username, id, ip, success]);
}

// Get all login attempts
async function getLoginAttempts(limit) {
    return await query("SELECT * FROM users.loginAttempts ORDER BY Timestamp DESC LIMIT ?", [limit]);
}

async function getLoginAttemptsBefore(data, limit) {
    return await query("SELECT * FROM users.loginAttempts WHERE timestamp <= ? ORDER BY Timestamp DESC LIMIT ?", [data, limit]);

}

// Register a namechange to the given username of a user with given ID
async function addUsernameChange(id, username) {
    return await query("INSERT INTO users.usernameChanges (uid, username) VALUES (?, ?)", [id, username]);
}

// Get all namechanges of a user with given id
async function getUsernameChangeHistory(id) {
    return await query("SELECT * FROM users.usernameChanges WHERE uid=?", [id]);
}

// Get latest namechange of a user with given id
async function getLatestUsernameChange(id) {
    return await query("SELECT * FROM users.usernameChanges WHERE uid=? ORDER BY Timestamp DESC LIMIT 1", [id]);
}

function addEmailChange(uid, email, ip) {
    return query("INSERT INTO users.emailChanges (uid, email, ip) VALUES (?, ?, ?)", [uid, email, ip]);
}

function getEmailChangeHistory(uid) {
    return query("SELECT * FROM users.emailChanges WHERE uid=?", [uid]);
}

function getLatestEmailChange(uid) {
    return query("SELECT * FROM users.emailChanges WHERE uid=? ORDER BY Timestamp DESC LIMIT 1", [uid]);
}

function addPasswordChange(uid, ip) {
    return query("INSERT INTO users.passwordChanges (uid, ip) VALUES (?, ?)", [uid, ip]);
}

function getPasswordChangeHistory(uid) {
    return query("SELECT * FROM users.passwordChanges WHERE uid=?", [uid]);
}

function getLatestPasswordChange(uid) {
    return query("SELECT * FROM users.passwordChanges WHERE uid=? ORDER BY timestamp DESC LIMIT 1", [uid]);
}

function addPasswordForgot(uid, ip) {
    return query("INSERT INTO users.passwordForgot (uid, ip) VALUES (?, ?)", [uid, ip]);
}

function confirmPasswordForgot(id, ip) {
    return query("UPDATE users.passwordForgot SET completed=1, ip_completed=?, timestamp_completed=CURRENT_TIMESTAMP WHERE id=?", [ip, id]);
}

function getPasswordForgotHistory(uid) {
    return query("SELECT * FROM users.passwordForgot WHERE uid=?", [uid]);
}

function getLatestPasswordForgot(uid) {
    return query("SELECT * FROM users.passwordForgot WHERE uid=? ORDER BY timestamp DESC LIMIT 1", [uid]);
}
//add pointer to certain song not related to a user
async function addSongRaw(filename, url, provider, cached=false) {
    return await query("INSERT INTO music.songs_raw (filename, url, provider, cached) VALUES (?, ?, ?, ?)", [filename, url, provider, cached]);
}

async function getSongRawByName(filename) {
    const result = await query("SELECT * FROM music.songs_raw WHERE filename=?", [filename]);
    if (result.length) {
        return result[0];
    } else {
        return null;
    }
}
// Get song
async function getSongRaw(srid) {
    let result = await query("SELECT * FROM music.songs_raw WHERE id=?", [srid]);
    if (result.length) {
        return result[0];
    } else {
        return null;
    }
}

//add convert from user pointing to song
async function addSong(srid, uid, title, artist) {
    return await query("INSERT INTO music.songs (srid, uid, title, artist) VALUES (?, ?, ?, ?)", [srid, uid, title, artist]);
}

async function getSong(id) {
    const result = await query("SELECT songs.id, songs_raw.id AS srid, songs_raw.filename, songs_raw.url, songs_raw.provider, songs.title, songs.artist, songs.uid FROM music.songs INNER JOIN music.songs_raw where songs.srid = songs_raw.id AND songs.id = ?", [id]);
    if (result.length) {
        return result[0];
    } else {
        return null;
    }
}

// Remove a convert with given id
async function removeSong(id) {
    return await query("DELETE FROM music.songs WHERE id=?", [id]);
}

// Set the title of the song with given id to the given title
async function setTitle(id, title) {
    return await query("UPDATE music.songs SET title=? WHERE id=?", [title, id]);
}

// Set the title of the song with given id to the given title
async function setArtist(id, artist) {
    return await query("UPDATE music.songs SET artist=? WHERE id=?", [artist, id]);
}

//MUST RETURN INSERT ID INSTEAD
// Add a playlist with given name for the given user
async function addPlaylist(uid, name="New Playlist") {
    return await query("INSERT INTO music.playlists (name, uid) VALUES (?, ?)", [name, uid]);
}

async function setNamePlaylist(id, name) {
    return await query("UPDATE music.playlists SET name=? WHERE id=?", [name, id]);
}
// Remove a playlist with given id
async function removePlaylist(id) {
    return await query("DELETE FROM music.playlists WHERE id=?", [id]);
}

// Add song with given id to playlist with given id
async function addSongToPlaylist(sid, pid) {
    return await query("INSERT INTO music.songInPlaylist (sid, pid) VALUES (?, ?)", [sid, pid]);
}

// Remove song with given id from playlist with given id
async function removeSongFromPlaylist(sid, pid) {
    return await query("DELETE FROM music.songInPlaylist WHERE sid=? AND pid=?", [sid, pid]);
}

// Get all songs of user with given id
async function getSongsOf(uid) {
    return await query("SELECT songs.id, songs_raw.id AS srid, songs.uid, songs_raw.url, songs_raw.filename, songs.artist, songs.title, songs_raw.cached, songs_raw.provider FROM music.songs INNER JOIN music.songs_raw WHERE songs.srid = songs_raw.id AND uid=?", [uid]);
}

// Get all songs in playlist with given id
async function getSongsIn(pid) {
    return await query("SELECT * FROM music.songInPlaylist INNER JOIN music.songs WHERE songInPlaylist.sid = songs.id AND songInPlaylist.pid=? ORDER BY artist, title", [pid]);
}

async function getSongsInPlaylistsOf(uid) {
    return await query("SELECT songs.id AS sid, playlists.id AS pid, playlists.name FROM music.songs INNER JOIN music.playlists, music.songInPlaylist WHERE songInPlaylist.pid = playlists.id AND songInPlaylist.sid = songs.id AND songs.uid = ?", [uid]);
}

// Get all songs decided by playlist and userid
async function getSongsSmart(pid, uid) {
    let songs;
    if (pid && pid > 0) {
        songs = await getSongsIn(pid);
    } else {
        songs = await getSongsOf(uid);
    }

    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        song.playlists = await getPlaylistsOfSong(song.id);
        song.playlistIds = song.playlists.map(playlist => playlist.id);
        song.playlistNames = song.playlists.map(playlist => playlist.name);
    }
    return songs;
}

// Get owner of the song with given id
async function getUserOfSong(sid) {
    let result = await query("SELECT uid FROM music.songs WHERE id=?", [sid]);
    if (result.length) {
        return result[0].uid;
    } else {
        return null;
    }
}

// Get all playlist of user with given id
async function getPlaylistsOf(uid) {
    return await query("SELECT * FROM music.playlists WHERE uid=? ORDER BY name", [uid]);
}

// Get owner of the playlist with given id
async function getUserOfPlaylist(pid) {
    let result = await query("SELECT uid FROM music.playlists WHERE id=?", [pid]);
    if (result.length) {
        return result[0].uid;
    } else {
        return null;
    }
}

// Get all playlist of user with given id
async function getPlaylistsOfSong(sid) {
    return await query("SELECT * FROM music.songInPlaylist JOIN music.playlists WHERE pid = id AND sid=? ORDER BY name", [sid]);
}

async function getPlaylistsOfSmart(uid) {
    let playlists = await getPlaylistsOf(uid);

    for (let i = 0; i < playlists.length; i++) {
        const playlist = playlists[i];
        const songs = await getSongsIn(playlist.id);
        playlist.numberOfSongs = songs.length;
    }
    return playlists;
}

async function getCalendarUrls(userId, calendarId) {
    const check_id = await checkCalendarOwner(userId, calendarId);
    if (!check_id) {
        return [];
    }
    return await query("SELECT * FROM calendar.urls WHERE cid = ?", [calendarId]);

}

async function getCalendarCourseNumbers(userId, calendarId) {
    const check_id = await checkCalendarOwner(userId, calendarId);
    if (!check_id) {
        return [];
    }
    return await query("SELECT * FROM calendar.courses WHERE cid = ?", [calendarId]);
}

async function getCalendarTable(userId) {
    return await query("SELECT * FROM calendar.calendars WHERE uid = ?", [userId]);
}

async function checkCalendarOwner(userId, calendarId) {
    let result = await query("SELECT id FROM calendar.calendars WHERE id = ? AND uid = ?", [calendarId, userId]);
    if (result.length){
        return true;
    } else {
        return false;
    }
}

// Return string without illegal chars for filename
function filename(string) {
    return string.replace("/[\\\\/:*?\"<>|]/", "");
}

// Return if the user with given id can do a namechange
async function canDoUsernameChange(id, days=30) {
    const data = await getLatestUsernameChange(id);
    const old = new Date(data[0].timestamp);
    return (Date.now() - old >= days * 24 * 60 * 60 * 1000);
}

module.exports = {
    getCalendarUrls,
    getCalendarCourseNumbers,
    getCalendarTable,
    query,
    register,
    unregister,
    isRegistered,
    isInUse,
    getIDByUsername,
    getIdByEmail,
    getUsernameByID,
    setUsername,
    getPasswordByID,
    setPassword,
    getEmailByID,
    setEmail,
    getLevelByID,
    getUsers,
    setLevel,
    addToken,
    getToken,
    getTokens,
    getTokenSafe,
    removeToken,
    setTokenIdentifier,
    addLoginAttempt,
    addLoginAttemptByID,
    getLoginAttempts,
    getLoginAttemptsBefore,
    addUsernameChange,
    getUsernameChangeHistory,
    getLatestUsernameChange,
    addEmailChange,
    getEmailChangeHistory,
    getLatestEmailChange,
    addPasswordChange,
    getPasswordChangeHistory,
    getLatestPasswordChange,
    addPasswordForgot,
    confirmPasswordForgot,
    getPasswordForgotHistory,
    getLatestPasswordForgot,
    addSongRaw,
    getSongRaw,
    getSongRawByName,
    addSong,
    getSong,
    removeSong,
    setTitle,
    setArtist,
    addPlaylist,
    setNamePlaylist,
    removePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    getSongsOf,
    getUserOfSong,
    getPlaylistsOf,
    getPlaylistsOfSmart,
    getUserOfPlaylist,
    getPlaylistsOfSong,
    getSongsIn,
    getSongsInPlaylistsOf,
    getSongsSmart,
    filename,
    canDoUsernameChange
};
