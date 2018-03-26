const Database = require("./Database");

module.exports = class User {
    constructor(id) {
        this.id = id;
    }

    static nullUser() {
        this.username = "Not Logged In";
        this.level = 0;
        this.password = "";
        this.email = "";
        return this;
    }

    async load() {
        this.username = await Database.getUsernameByID(this.id);
        this.level = await Database.getLevelByID(this.id);
        this.password = await Database.getPasswordByID(this.id);
        this.email = await Database.getEmailByID(this.id);
        return this;
    }

    static async resolveUsernameToId(username) {
        return await Database.getIDByUsername(username);
    }

    async changeUsername(name) {
        Database.addUsernameChange(this.id, name);
        return await Database.changeUsername(this.id, name);
    }

    async setPassword(hash) {
        return await Database.setPassword(this.id, hash);
    }

    async setEmail(email) {
        return await Database.setEmail(this.id, email);
    }

    async setLevel(level) {
        return await Database.setLevel(this.id, level);
    }
}
