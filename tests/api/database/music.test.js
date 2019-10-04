const crypto = require('crypto');
const db = require('../../../api/src/database');

describe('testing database token', () => {
    const username = crypto.randomBytes(8).toString('hex');
    const password = crypto.randomBytes(8).toString('hex');

    let user, songRaw, song, playlist;

    beforeAll(async () => {
        user = await db.Users.create({
            username,
            password,
            email: `${username}@dupbit.com`,
            permissions: 1+4,
        }, {
            req: {
                ip: '0.0.0.0',
            },
        });
    });

    afterAll(async () => {
        // await user.destroy();
    });

    test('create songraw', async () => {
        const result = await db.SongsRaw.create({
            filename: 'dddddd.mp3',
            url: 'https://prover.com/ddddd',
            provider: 'pppp',
        });

        expect(result.get().filename).toBe('dddddd.mp3');
        expect(result.get().url).toBe('https://prover.com/ddddd');
        expect(result.get().provider).toBe('pppp');
        expect(result.get().cached).toBeFalsy();
        expect(result.get().downloads).toBe(0);

        songRaw = result;
    });

    test('create song', async () => {
        const result = await songRaw.createSong({
            title: 'title',
            artist: 'artist',
            uid: user.get().id,
        });

        expect(result.get().title).toBe('title');
        expect(result.get().artist).toBe('artist');
        expect(result.get().uid).toBe(user.get().id);
        expect(result.get().srid).toBe(songRaw.id);

        song = result;
    });

    test('create playlist', async() => {
        const result = await user.createPlaylist({
            name: 'playlist',
        });

        expect(result.get().name).toBe('playlist');
        expect(result.get().uid).toBe(user.get().id);

        playlist = result;
    });

    test('add song to playlist', async() => {
        const result = await db.SongsInPlaylist.create({
            sid: song.get().id,
            pid: playlist.get().id,
        });

        expect(result.get().sid).toBe(song.get().id);
        expect(result.get().pid).toBe(playlist.get().id);
    });
});
