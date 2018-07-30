const { convert, createFilename } = require("../../../src/music/index");

module.exports = async (req, res) => {
    const data = req.body;

    if (req.auth.isLoggedIn && data.url) {

        res.set("Access-Control-Allow-Credentials", "true");
        res.set("Access-Control-Allow-Origin", req.headers.origin ? req.headers.origin : `chrome-extension://${data.origin}`);
        if (req.auth.level >= 2) {
            const id = await convert(
                req.auth.id,
                data.provider ? data.provider : "unknown",
                data.url,
                data.title,
                data.artist);

            if (data.remote) {
                res.json({
                    success: true,
                    id,
                    downloadUrl: `https://dupbit.com/api/music/song?id=${id}`,
                    filename: createFilename(data.title, data.artist, data.url)+".mp3",
                });
            } else {
                res.redirect(`/api/music/song?id=${id}`);
            }
        } else {
            const id = data.url.split("watch?v=")[1].split("&")[0];

            if (data.remote) {
                res.json({
                    success: true,
                    id,
                    downloadUrl: `https://dupbit.com/api/music/downloadMetaData?id=${id}`,
                    filename: createFilename(data.title, data.artist, data.url)+".txt"
                });
            } else {
                res.redirect(`api/music/downloadMetaData?id=${id}`);
            }
        }
    } else {
        res.status(403).json({
            success: false,
            reason: "authentication required",
        });
    }
};
