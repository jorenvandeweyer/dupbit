const Cache = require("./util/Cache");
const Url = require("./util/Url");
const ejs = require('ejs');
const Data = require('./util/Data');
const Database = require("./util/Database");
const Cookie = require("./util/Cookie");

const cache = new Cache();

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.ics': 'text/calendar',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml',
    '.ejs': 'text/html',
    '.ico': 'image/x-icon',
};

class Page {
    constructor(url, request) {
        this.url = url;
        this.cookies = Cookie.parse(request.headers.cookie);
        this.subPage = new Map();
        // this.status = 200;
        this.header = {
            "Content-Type": mimeTypes[url.ext],
            "Cache-Control": `max-age=86400`,
        };
    }

    async load() {
        this.content = await cache.get(this.url);
        let data = await Data.get(this);
        if (data.redirectHeader) {
            this.status = data.status;
            this.header["Location"] = data.redirectHeader;
        } else if (this.content) {
            this.status = data.status
            if(this.url.ext === ".ejs") {
                this.content = await ejs.render(this.content, data, {filename: this.url.fullPath});
                // this.header["Content-Type"] = mimeTypes[data.mimeType];
            }
        } else {
            this.status = 404;
            this.content = await cache.get(new Url("/notfound"));
            this.content = await ejs.render(this.content, data, {filename: this.url.fullPath});
            this.header["Content-Type"] = mimeTypes[".ejs"];
        }
        return this;
    }
}

async function get(url, request) {
    return new Page(url, request).load();
}

module.exports = {
    get,
};
