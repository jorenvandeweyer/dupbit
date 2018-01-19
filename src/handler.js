const Cache = require("./util/Cache");
const Url = require("./util/Url");
const Dupbit = require("./dupbit");
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
    constructor(url, params) {
        this.url = url;
        this.params = {
            currentPage: "index",
            title: "HELLO",

        };
        this.subPage = new Map();
        this.status = 200;
        this.contentType = mimeTypes[url.ext];
        this.offset = 0;
    }

    async load() {
        this.content = await cache.get(this.url);
        if (this.content) {
            this.status = 200;
            if (this.url.ext === ".html") {
                await this.ifStatements();
                await this.extendPage();
                await this.fillParams();
                await this.execFun();
            }
        } else {
            this.status = 404;
            this.content = await cache.get(new Url("/notfound"));
            await this.ifStatements();
            await this.extendPage();
            await this.fillParams();
            await this.execFun();
        }
        return this;
    }

    executeIf(begin, end){
        let code = this.content.slice(begin, end);
        let match = code.match(/<\?node\s*if\((.*)\)\s*\?>((.*\n)+?)\s*<\?node\s+\?>/);
        let replacement = returnOnTrue(match[1], match[2]);

        this.content = this.content.slice(0, begin) + replacement + this.content.slice(end, this.content.length);
    }

    async ifStatements() {
        let begin = [];
        let end = [];
        let regB = /<\?node\s*if\((.*)\)\s*\?>/g;
        let regE = /<\?node\s+\?>/g;
        let result;

        while ((result = regB.exec(this.content)) !== null) {
            result.lastIndex = regB.lastIndex
            begin.push(result);
        }
        while ((result = regE.exec(this.content)) !== null) {
            result.lastIndex = regE.lastIndex
            end.push(result);
        }

        for(let i = 0; i < begin.length; i++){
            let nextStart = Infinity;
            if(i+1 < begin.length) nextStart = begin[i+1].lastIndex;
            if(end[0].lastIndex < nextStart){
                this.executeIf(begin[i].index, end[0].lastIndex);
                end.splice(0, 1);
                begin.splice(i, 1);
                return await this.ifStatements();
            }
        }
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
    }

    async fillParams() {
        let match = this.content.match(/<\?node\s*\$([A-z]+)\s*\?>/);
        if (match === null) return;
        this.content = this.content.replace(/<\?node\s*\$([A-z]+)\s*\?>/, this.params[match[1]]);
        return await this.fillParams();
    }

    async execFun() {
        let match = this.content.match(/<\?node\s*\?(.+)\s*\?>/);
        if (match === null) return;
        this.content = this.content.replace(/<\?node\s*\?(.+)\s*\?>/, Dupbit.evalFun(match[1]));
        return await this.fillParams();
    }
}

function returnOnTrue(statement, content){
    if(Dupbit.evalFun(statement)){
        console.log("true");
        return content;
    } else {
        return "";
    }
}

async function get(url) {
    return new Page(url).load();
}

module.exports = {
    get
};
