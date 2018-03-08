const Cache = require("./util/Cache");
const Url = require("./util/Url");
const Dupbit = require("./dupbit");
const ejs = require('ejs');
const Data = require('./util/Data');
const Database = require("./util/Database");

const cache = new Cache();

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml',
    '.ejs': 'text/html'
};

class Page {
    constructor(url, request) {
        this.url = url;
        this.cookies = parseCookies(request);
        this.subPage = new Map();
        // this.status = 200;
        this.header = {
            "Content-Type": mimeTypes[url.ext]
        };
    }

    // async load() {
    //     // this.params = await new Data(this.params).load();
    //     this.content = await cache.get(this.url);
    //     if (this.content) {
    //         this.status = 200;
    //         if (this.url.ext === ".ejs") {
    //             this.content = await ejs.render(this.content, this.params, {filename: this.url.fullPath});
    //         }
    //     } else {
    //         this.status = 404;
    //         this.content = await cache.get(new Url("/notfound"));
    //         this.content = await ejs.render(this.content, this.params, {filename: this.url.fullPath});
    //     }
    //     return this;
    // }

    async load2() {
        this.content = await cache.get(this.url);
        let data = await Data.get(this);
        console.log(data);
        if (this.content) {
            this.status = data.status;
            if(this.url.ext === ".ejs") {
                this.content = await ejs.render(this.content, data, {filename: this.url.fullPath});
                // this.header["Content-Type"] = mimeTypes[data.mimeType];
            }
        } else {
            this.status = 404;
            this.concent = await cache.get(new Url("/notfound"));
            this.content = await ejs.render(this.content, this.params, {filename: this.url.fullPath});
            this.header["Content-Type"] = mimeTypes[".ejs"];
        }
        return this;
    }

    addCookie(name, content, expires=1000*60*60*24*365) {
        this.header["Set-Cookie"] = `${name}=${content}; expires=${new Date(Date.now() + expires).toUTCString()}`;
    }
}

async function get(url, request) {
    return new Page(url, request).load2();
}

function parseCookies (request) {
    let list = {};
    let rc = request.headers.cookie;

    rc && rc.split(';').forEach((cookie) => {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

module.exports = {
    get,
};
