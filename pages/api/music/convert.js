const { spawn } = require('child_process');
const fs = require("fs");

function downloadVideo(url) {

    return new Promise((resolve, reject) => {
        const downloader = spawn('youtube-dl', [url, '--id', '-x', '--audio-format', 'mp3', '--exec', 'mv {} data/music/']);

        let filename;
        downloader.stdout.on('data', (data) => {
            let raw = data.toString().split("\n").filter(line => line.includes("Destination:"));
            if (raw.length) {
                filename = raw[raw.length-1].split("Destination: ")[1];
            }
            // console.log(data.toString());
        });

        downloader.stderr.on('data', (data) => {
            // console.log(`stderr: ${data}`);
        });

        downloader.on('close', (code) => {
            resolve(filename);
        });
    });
}

async function checkFile(url) {
    if (url.includes("youtube.com/watch?v=")){
        const id = url.split("watch?v=")[1].split("&list")[0];
        if (fs.existsSync(`data/music/${id}.mp3`)) {
            return `${id}.mp3`;
        }
    }
    return false;
}

async function resolve(data, apidata) {
    if (data.url) {
        const isDownloaded = await checkFile(data.url);
        let filename;
        if (isDownloaded) {
            filename = isDownloaded;
        } else {
            filename = await downloadVideo(data.url);
        }
        const file = fs.readFileSync(`data/music/${filename}`);
        return {
            success: true,
            download: file,
            name: filename,
        };
    }
    return {
        success: false,
    };
}

module.exports = {
    resolve
};
