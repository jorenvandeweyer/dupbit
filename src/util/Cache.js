const Collection = require("./Collection");
const path = require("path");
const fs = require("fs");

class Cache {
    constructor() {
        this.cache = new Collection();
    }

    async get(url) {
        console.log(url.fullPath);
        console.log(url.shortPath)
        if (!this.cache.has(url.shortPath)) {
            let file = await this.loadFile(url.fullPath, url.type);
            if (file) {
                console.log(`Cached: ${url.shortPath}!`);
                this.cache.set(url.shortPath, file);
            } else {
                console.log(`No such path: ${url.shortPath}!`)
                return null;
            }
        } else {
            console.log(`Already cached: ${url.shortPath}!`);
        }
        return this.cache.get(url.shortPath);
    }

    async loadFile(path, type) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(path)) {
                fs.readFile(path, type, (err, data) => {
                    if (err) return reject(err);
                    return resolve(data);
                });
            } else {
                return resolve(null);
            }
        }).catch((err) => {
            console.log(err);
        });
    }
}

module.exports = Cache;
