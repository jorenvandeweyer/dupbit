const path = require("path");
const fs = require("fs");

class Cache {
    constructor() {
        this.cache = new Map();
    }

    async get(url) {
        if (!this.cache.has(url.shortPath)) {
            let file = await this.loadFile(url.fullPath, url.type);
            if (file) {
                this.cache.set(url.shortPath, file);
            } else {
                return null;
            }
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
