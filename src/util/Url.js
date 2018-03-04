const path = require("path");
const url2 = require("url");
const absolute = path.dirname(process.mainModule.filename);

class Url {
    constructor(url) {
        this.type = "";
        this.url = url2.parse(url, true);
        if(this.url.pathname === "/") this.url.pathname = "/index";
        this.path = path.parse(this.url.pathname);
        if(this.path.dir === "/") this.path.dir === "";
        if(this.path.ext === "" || this.path.ext === ".ejs") {
            this.path.dir = `/pages${this.path.dir}`;
            this.path.ext = ".ejs";
            this.type = "utf8";
        }
    }

    static get dirTop() {
        return absolute;
    }

    get shortPath() {
        return `${this.path.dir}/${this.fullFilname}`;
    }

    get fullPath() {
        return `${absolute}${this.shortPath}`;
    }

    get fullAPIPath() {
        return `${absolute}/pages${this.shortPath}`;
    }

    get ext() {
        return this.path.ext;
    }

    get filename() {
        return this.path.name;
    }

    get fullFilname() {
        return `${this.filename}${this.ext}`;
    }

    get query() {
        return this.url.query;
    }

    queryHas(param) {
        return (param in this.url.query);
    }

    queryGet(param) {
        if (!(param in this.url.query)) return null;
        return this.url.query[param];
    }

}

module.exports = Url;
