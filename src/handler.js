const Cache = require("./util/Cache");
const Url = require("./util/Url");

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
    '.svg': 'application/image/svg+xml'
};

class Page {
    constructor(url) {
        this.subPage = new Map();
        this.url = url;
        this.status = 200;
        this.contentType = mimeTypes[url.ext];
    }

    async load() {
        this.content = await cache.get(this.url);
        if (this.content) {
            this.status = 200;
            if (this.url.ext === ".html") {
                await this.extendPage();
                await this.fillParams();
            }
        } else {
            this.status = 404;
            this.content = await cache.get(new Url("/notfound"));
            await this.extendPage();
            await this.fillParams();
        }
        return this;
    }

    async extendPage() {
        let match = this.content.match(/<\?node\s*include\("(.+)"\)\s*\?>/);
        if (match === null) return;

        let url = new Url(match[1], "");

        let subPage = await new Page(url).load();

        if (subPage) {
            this.content = this.content.replace(/<\?node\s*include\("(.+)"\)\s*\?>/, subPage.content);
            return await this.extendPage();
        } else {
            return this;
        }
        // return page.replace(/<\?node\s*\$([A-z]+)\s*\?>/g, "x");
    }

    async fillParams() {

    }
}

function replaceParams(page, params){
}

async function loadPage(path, ext="html"){
    return new Promise((resolve, reject) => {
        if (fs.existsSync(`pages${path}.${ext}`)) {
            fs.readFile(`pages${path}.${ext}`, "utf8", (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        } else {
            fs.readFile("pages/notfound.html", "utf8", (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        }
    });
}

async function get(url) {
    return new Page(url).load();
}

module.exports = {
    get
};
