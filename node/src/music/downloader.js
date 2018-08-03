const RawIPC = require("node-ipc").IPC;
const EventEmitter = require("events");

class YouTubeDownloader extends EventEmitter {
    constructor(url, filename="") {
        super();
        this.autoResolve = true;
        this._promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.ipc = new RawIPC;
        this.ipc.config.id = "client";
        this.ipc.config.retry = 1500;
        this.ipc.config.silent = true;

        this.ipc.connectToNet("youtube-dl-api", "youtube-dl", 8000, () => { this.connect({url, filename}); });
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
            if (this.autoResolve) this.resolve(data);
            this.ipc.disconnect("youtube-dl-api");
        });

        this.ipc.of["youtube-dl-api"].on("error", () => {
            this.reject();
            this.ipc.disconnect("youtube-dl-api");
        });
    }
}
module.exports = YouTubeDownloader;
