const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

class Cache {
    constructor() {
        this.cache = new Map();
    }

    async get(url) {
        if (!this.cache.has(url.shortPath)) {
            if (url.isFile()) {
                const file = await readFile(url.fullPath, url.type).catch(() => null);
                if (file && process.env.NODE_ENV === "production") {
                    this.cache.set(url.shortPath, file);
                } else if (file) {
                    return file;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
        return this.cache.get(url.shortPath);
    }

    flush() {
        this.cache = new Map();
    }
}

module.exports = Cache;
