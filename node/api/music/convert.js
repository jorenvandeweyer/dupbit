const { convert, createFilename } = require("../../src/music/index");
const ws = require("../../src/websocket/index");

module.exports = async (req, res) => {
    const data = req.body;
    if (req.auth.isLoggedIn && data.url) {

        res.set("Access-Control-Allow-Credentials", "true");
        res.set("Access-Control-Allow-Origin", req.headers.origin ? req.headers.origin : `chrome-extension://${data.origin}`);
        if (req.auth.level >= 2) {
            const downloader = await convert(
                req.auth.uid,
                data.provider ? data.provider : "unknown",
                data.url,
                data.title,
                data.artist);

            if (typeof downloader === "number") {
                const id = downloader;
                res.json({
                    success: true,
                    id,
                    downloadUrl: `/api/music/song?id=${id}&download`,
                    filename: createFilename(data.title, data.artist, data.url)+".mp3",
                });
            } else {
                const socket = ws.findConnection(req.auth.uid, req.auth.tid);
                const qid = data.qid;
                if (socket && typeof qid != "undefined") {
                    downloader.on("state-change", (data) => {
                        socket.send(JSON.stringify({
                            update: {
                                qid,
                                data,
                            }
                        }));
                    });
                }


                const id = await downloader._promise;
                res.json({
                    success: true,
                    id,
                    downloadUrl: `/api/music/song?id=${id}&download`,
                    filename: createFilename(data.title, data.artist, data.url) + ".mp3"
                });
            }

        } else {
            const id = data.url.split("watch?v=")[1].split("&")[0];

            if (data.remote) {
                res.json({
                    success: true,
                    id,
                    downloadUrl: `/api/music/downloadMetaData?id=${id}`,
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
