const Path = require("path");
const url2 = require("url");
const fs = require("fs");
const absolute = Path.dirname(process.mainModule.filename);
const utf8 = [".ejs", ".js"];

class Url {
    constructor(url, suggestedExt, dir="") {
        this.original = url;

        const url_parsed = url2.parse(this.original, true);
        this.pathname = url_parsed.pathname;

        if (fs.existsSync(`${absolute}${dir}${this.pathname}`)) {
            if (fs.lstatSync(`${absolute}${dir}${this.pathname}`).isDirectory()) {
                if (this.pathname === "/") this.pathname = ""; //dirtyfix should improve logic!
                this.pathname += "/index";
            }
        }

        const path = Path.parse(this.pathname);

        this.name = path.name;
        this.ext = path.ext || suggestedExt;

        if (path.dir === "/") path.dir = "";
        this.dir = `${dir}${path.dir}`;

        if (utf8.includes(this.ext)) {
            this.type = "utf8";
        }
    }

    static get dirTop() {
        return absolute;
    }

    get shortPath() {
        return `${this.dir}/${this.fullFileName}`;
    }

    get fullPath() {
        return `${absolute}${this.shortPath}`;
    }

    get filename() {
        return this.name;
    }

    get fullFileName() {
        return `${this.filename}${this.ext}`;
    }
}

module.exports = Url;
