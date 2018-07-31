const Music = require("../../../src/music/index");
const db =  require("../../../src/util/Database");

module.exports = async (req, res) => {
    const data = req.query;

    if (req.auth.isLoggedIn && req.auth.level >= 2) {
        if (data.id) {
            const song = await db.getSong(data.id);
            if (song && song.uid === req.auth.id) {
                const stream = await Music.stream(song);
                res.set("Content-dispotition", "filename=\"stream.mp3\"");
                res.set("Content-length", stream.length);
                res.set("Cache-Control", "no-cache");
                res.set("Content-Transfer-Encoding", "chunked");
                res.set("Content-Type", "audio/mpeg");
                res.send(stream);
            } else {
                res.status(403).json({
                    success: false,
                    reason: "provide an id",
                });
            }
        } else {
            res.status(403).json({
                success: false,
                reason: "provide an id",
            });
        }
    } else {
        res.status(403).json({
            success: false,
            reason: "need to be authenticated",
        });
    }
};
