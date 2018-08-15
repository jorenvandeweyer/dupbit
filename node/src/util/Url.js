const Path = require("path");
const url2 = require("url");
const fs = require("fs");
const util = require("util");
const absolute = Path.dirname(process.mainModule.filename);
const utf8 = [".ejs", ".js"];

const stat = util.promisify(fs.stat);

class Url {
    constructor(path, dir, name, ext) {
        this.path = path;
        this.dir = dir;
        this.name = name;
        this.ext = ext;
        if (utf8.includes(this.ext)) {
            this.type = "utf8";
        }
    }

    static async new (url, suggestedExt, dir="") {
        let path = url.split("?")[0];
        const stats_dir = await stat(`${absolute}${dir}${path}`).catch(() => null);

        if (stats_dir && stats_dir.isDirectory()) {
            if (path[path.length-1] !== "/") path += "/";
            path += "index";
        }

        const path_parsed = Path.parse(path);

        const directory = `${dir}${path_parsed.dir}`;
        const name = path_parsed.name;
        const ext = path_parsed.ext || suggestedExt;

        const c = new Url(path, directory, name, ext);

        return c;
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

    async isFile() {
        const s = await stat(this.fullPath);
        return s.isFile();
    }
}

module.exports = Url;
