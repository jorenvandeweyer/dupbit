const Session = require('express-session');
// const Dupbit = require("../dupbit");
const Database = require("./Database");
const pageInfo = require("../../data/pages");
const Url = require("./Url");

class Data {
    constructor(page) {
        this.pageData = page;
        this.page = pageInfo[this.pageData.url.url.pathname];
        this.lang = require("../../lang/en.json");
        this.session = {
            isLoggedIn: true
        };
        this.user = {
            level: 1,
            username: "Joren"
        };
        this.path = page.url.url.pathname;
        this.mimeType = ".ejs";
        this.errorMessageList = [];
    }

    async load() {
        this.status = 200;
        return this;
    }
}

async function get(page) {
    return new Data(page).load();
}

module.exports = {
    get
};
