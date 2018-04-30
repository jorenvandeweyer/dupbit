const Path = require("path");
const url2 = require("url");
const fs = require("fs");
const absolute = Path.dirname(process.mainModule.filename);
const utf8 = [".ejs", ".js"];

class Url {
    constructor(url) {
        this.original = url;

        const url_parsed = url2.parse(this.original, true);
        this.query = url_parsed.query;
        this.pathname = url_parsed.pathname;

        if (fs.existsSync(`${absolute}/pages${this.pathname}`)) {
            if (fs.lstatSync(`${absolute}/pages${this.pathname}`).isDirectory()) {
                if (this.pathname === "/") this.pathname = ""; //dirtyfix should improve logic!
                this.pathname += "/index";
            }
        }

        const path = Path.parse(this.pathname);

        this.name = path.name
        this.ext = path.ext || ".ejs";

        if (path.dir === "/") path.dir = "";
        this.dir = `/pages${path.dir}`

        if (utf8.includes(this.ext)) {
            this.type = "utf8";
        }
    }

    static get dirTop() {
        return absolute;
    }

    get shortPath() {
        return `${this.dir}/${this.fullFilname}`;
    }

    get fullPath() {
        return `${absolute}${this.shortPath}`;
    }

    get filename() {
        return this.name;
    }

    get fullFilname() {
        return `${this.filename}${this.ext}`;
    }

    queryHas(param) {
        return (param in this.query);
    }

    queryGet(param) {
        if (!(param in this.query)) return null;
        return this.query[param];
    }

}

module.exports = Url;
