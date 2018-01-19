const path = require("path");
const url2 = require("url");
const absolute = path.dirname(process.mainModule.filename);

class Url {
    constructor(url, location="/pages") {
        this.location = location
        this.type = "";
        this.url = url2.parse(url, true);
        if(this.url.pathname === "/") this.url.pathname = "/index";
        this.path = path.parse(this.url.pathname);
        if(this.path.ext === "" || this.path.ext === ".html") {
            this.path.ext = ".html";
            this.type = "utf8";
        } else if (this.path.ext === ".png" || this.path.ext === ".otf") {
            this.location="";
        }
        if(this.path.dir === "/") this.path.dir = "";
    }

    static get dirTop() {
        return absolute;
    }

    get shortPath() {
        return `${this.path.dir}/${this.fullFilname}`;
    }

    get fullPath() {
        return `${absolute}${this.location}${this.shortPath}`;
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
