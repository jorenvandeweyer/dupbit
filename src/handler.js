const Cache = require("./util/Cache");
const Url = require("./util/Url");
const Dupbit = require("./dupbit");
const ejs = require('ejs');
// const Data = require('./util/Data');
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
        this.params = {
            currentPage: "index",
            path: Url.dirTop + "/pages",
            test: function() {
                return "hi";
            },
            getLogin: function() {
                return 1;
            },
            getLevelByID: function(id) {
                return 1;
            },
            isLoggedIn: function() {
                return true;
            },
            getUsernameByID: function(id) {
                return "Joren";
            }
            // include: async function(path) {
            //     let url = new Url(path);
            //     let subPage = await new Page(url).load();
            //     return subPage.content;
            // }
        };
        this.cookies = parseCookies(request);
        this.subPage = new Map();
        // this.status = 200;
        this.data = {
            "Content-Type": mimeTypes[url.ext]
        };
    }

    async load() {
        // this.params = await new Data(this.params).load();
        this.content = await cache.get(this.url);
        if (this.content) {
            this.status = 200;
            if (this.url.ext === ".ejs") {
                console.log(this.params);
                this.content = await ejs.render(this.content, this.params, {filename: this.url.fullPath});
                console.log(ejs);
            }
        } else {
            this.status = 404;
            this.content = await cache.get(new Url("/notfound"));
            this.content = await ejs.render(this.content, this.params, {filename: this.url.fullPath});
        }
        return this;
    }

    async load2() {
        let data = await Data.get(this);
        if (this.content) {
            this.status = data.status;
            this.content = await ejs.render(this.content, this.params, {filename: this.url.fullPath});
            this.data["Content-Type"] = mimeTypes[data.mimeType];

        } else {
            this.status = 404;
            this.concent = await cache.get(new Url("/notfound"));
            this.content = await ejs.render(this.content, this.params, {filename: this.url.fullPath});
            this.data["Content-Type"] = mimeTypes[".ejs"];
        }
    }

    addCookie(name, content, expires=1000*60*60*24*365) {
        this.data["Set-Cookie"] = `${name}=${content}; expires=${new Date(Date.now() + expires).toUTCString()}`;
    }
}

async function get(url, request) {
    return new Page(url, request).load();
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
    get
};
