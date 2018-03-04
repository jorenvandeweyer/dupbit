const bcrypt = require('bcrypt');

module.exports = class {
    constructor() {
        this.sessions = new Map();
    }

    create(id) {
        this.sessions.set(id, {
            isLoggedIn: true,
            id: id
        });
    }

    async get(cookies) {
        if (this.sessions.has("1")) {
            return this.sessions.get("1");
        } else {
            return {
                isLoggedIn: false
            };
        }
    }
}
