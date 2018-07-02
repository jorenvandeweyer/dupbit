const fs = require("fs");
const RawIPC = require("node-ipc").IPC;
const EventEmitter = require("events");
const Url = require("url");
const db = require("../../../src/util/Database");

class YouTubeDownloader extends EventEmitter {
    constructor(url) {
        super();
        this.ipc = new RawIPC;
        this.ipc.config.id = "client";
        this.ipc.config.retry = 1500;
        this.ipc.config.silent = true;

        this.ipc.connectToNet("youtube-dl-api", "youtube-dl", 8000, () => { this.connect(url); });
    }

    connect(url) {
        this.ipc.of["youtube-dl-api"].on("connect", () => {
            this.ipc.of["youtube-dl-api"].emit("download", url);
            this.emit("open");
        });

        this.ipc.of["youtube-dl-api"].on("disconnect", () => {
            this.emit("close");
        });

        this.ipc.of["youtube-dl-api"].on("state-change", (data) => {
            this.emit("state-change", data);
        });

        this.ipc.of["youtube-dl-api"].on("open", (data) => {
            this.emit("started", data);
        });

        this.ipc.of["youtube-dl-api"].on("close", (data) => {
            this.emit("finished", data);
            this.ipc.disconnect("youtube-dl-api");
        });

        this.ipc.of["youtube-dl-api"].on("error", () => {
            this.ipc.disconnect("youtube-dl-api");
        });
    }
}

async function downloadVideo(url) {
    return new Promise((resolve, reject) => {
        const downloader = new YouTubeDownloader(url);

        downloader.on("finished", (data) => {
            resolve(data);
        });

        downloader.on("error", (data) => {
            reject(data);
        });
    });
}

function checkFile(url) {
    if (url.includes("youtube.com/watch?v=")){
        const id = url.split("watch?v=")[1].split("&")[0];
        if (fs.existsSync(`data/music/${id}.mp3`)) {
            return `${id}.mp3`;
        }
    }
    return false;
}

async function resolve(data, apidata) {
    if (apidata.session.isLoggedIn && data.url) {
        if (apidata.session.level >=2) {
            const isDownloaded = checkFile(data.url);
            if (!isDownloaded) {
                await downloadVideo(data.url);
            }
            const id = await updateDatabase(data.url, data.title, data.artist, apidata.session.id);
            return {
                success: true,
                id,
                downloadUrl: `https://dupbit.com/api/music/downloadSong?id=${id}`,
                filename: createFilename(data.title, data.artist, data.url),
                redirect: data.remote ? false : `api/music/downloadSong?id=${id}`,
                headers: {
                    "Access-Control-Allow-Origin": apidata.request.headers.origin ? apidata.request.headers.origin : `chrome-extension://${data.origin}`,
                    "Access-Control-Allow-Credentials": "true",
                },
            };
        } else {
            const id = data.url.split("watch?v=")[1].split("&")[0];
            return {
                success: true,
                id,
                downloadUrl: `https://dupbit.com/api/music/downloadMetaData?id=${id}`,
                filename: createFilename(data.title, data.artist, data.url),
                redirect: data.remote ? false : `api/music/downloadMetaData?id=${id}`,
                headers: {
                    "Access-Control-Allow-Origin": apidata.request.headers.origin ? apidata.request.headers.origin : `chrome-extension://${data.origin}`,
                    "Access-Control-Allow-Credentials": "true",
                },
            };
        }
    }
    return {
        success: false,
        reason: "authenticate",
    };
}

function createFilename(title, artist, url) {
    if (title !== "" && artist !==  "") return `${artist} - ${title}`;
    if (title !== "") return title;
    if (artist !== "") return artist;
    return url.split("watch?v=")[1].split("&")[0];
}

async function updateDatabase(url, title, artist, uid) {
    let id = url;
    if (url.includes("youtube.com/watch")) {
        const url_parsed = Url.parse(url, true);
        if ("v" in url_parsed.query) {
            id = url_parsed.query["v"];
        }
    }

    const result = await db.addSong(id, title, artist, uid);
    return result.insertId;
}

module.exports = {
    resolve,
    downloadVideo,
};
