// const Session = require('express-session');
// const Dupbit = require("../dupbit");
const Database = require("./Database");
const pageInfo = require("../../data/pages");
const Url = require("./Url");
const Session = require("./Session");
const User = require("./User");

const sessions = new Session();

class Data {
    constructor(page) {
        this.page = page;
        this.pageInfo = pageInfo[this.page.url.url.pathname];
        this.lang = require("../../lang/en.json");
        this.path = this.page.url.url.pathname;
        this.mimeType = ".ejs";
        this.errorMessageList = [];
        this.addQuery();
    }

    addQuery() {
        let query = this.page.url.url.query;
        for (let key in query) {
            this[key] = query[key];
        }
    }

    async load() {
        this.session = await sessions.get(this.page.cookies);
        this.user = await new User(this.session.id).load();
        this.status = 200;
        return this;
    }
}

async function get(page) {
    return new Data(page).load();
}

function createSession(id) {
    sessions.create(id);
}

module.exports = {
    get,
    createSession
};
