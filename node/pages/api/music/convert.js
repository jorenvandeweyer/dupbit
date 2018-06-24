const { spawn } = require("child_process");
const fs = require("fs");
const db = require("../../../src/util/Database");
const Url = require("url");

function downloadVideo(url) {
    return new Promise((resolve, reject) => {
        const downloader = spawn("youtube-dl", [url.split("&")[0], "--id", "-x", "--audio-format", "mp3", "--exec", "mv {} data/music/"]);

        let filename;
        downloader.stdout.on("data", (data) => {
            let raw = data.toString().split("\n").filter(line => line.includes("Destination:"));
            if (raw.length) {
                filename = raw[raw.length-1].split("Destination: ")[1];
            }
            // console.log(data.toString());
        });

        downloader.stderr.on("data", (data) => {
            if (data.includes("stopped")) {
                reject(data);
            }
            // console.log(`stderr: ${data}`);
        });

        downloader.on("close", () => {
            resolve(filename);
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
    if (apidata.session.isLoggedIn && apidata.session.level >=2 && data.url) {
        const isDownloaded = checkFile(data.url);
        if (!isDownloaded) {
            await downloadVideo(data.url);
        }
        const id = await updateDatabase(data.url, data.title, data.artist, apidata.session.id);
        console.log({
            success: true,
            id,
            redirect: data.remote ? false : `api/music/downloadSong?id=${id}`,
        });
        return {
            success: true,
            id,
            redirect: data.remote ? false : `api/music/downloadSong?id=${id}`,
            headers: {
                "Access-Control-Allow-Origin": apidata.request.headers.origin ? apidata.request.headers.origin : `chrome-extension://${data.origin}`,
                "Access-Control-Allow-Credentials": "true",
            },
        };
    }
    return {
        success: false,
    };
}

async function updateDatabase(url, title, artist, uid) {
    let id = url;
    if (url.includes("youtube.com/watch")) {
        const url = new Url(url);
        if (url.searchParams.has("v")) {
            id = url.searchParams.get("v");
        }
    }

    const result = await db.addSong(id, title, artist, uid);
    return result.insertId;
}

module.exports = {
    resolve,
    downloadVideo,
};
