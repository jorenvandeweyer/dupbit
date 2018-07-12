const pageInfo = require("../../data/pages");
const User = require("./User");
const Token = require("./Token");
const Database = require("./Database");
const ws = require("../websocket/index");

class Data {
    constructor(page) {
        this.page = page;
        this.pageInfo = pageInfo[this.page.url.pathname];
        if (this.pageInfo == undefined) {
            this.pageInfo = pageInfo["/notfound"];
        }
        this.lang = require("../../lang/en.json");
        this.path = this.page.url.pathname;
        this.mimeType = ".ejs";
        this.errorMessageList = [];
        this.addQuery();
    }

    addQuery() {
        this.query = this.page.url.query;
    }

    async load() {
        let decoded = await Token.verifyToken(this.page.cookies["sid"]);

        if (decoded) {
            this.session = decoded.data;
            this.user = await new User(this.session.id).load();
        } else {
            this.session = {
                isLoggedIn: false,
            };
            this.user = User.nullUser();
        }

        if (this.pageInfo) {
            if (this.pageInfo.requireLogout && this.session.isLoggedIn) {
                this.status = 303;
                this.redirectHeader = "/welcome";
            } else if (this.pageInfo.requireLogin && !this.session.isLoggedIn) {
                this.status = 303;
                this.redirectHeader = "/login?redirect=" + this.pageInfo.currentPage;
            } else if (this.pageInfo.requireLevel && this.pageInfo.requireLevel > this.session.level) {
                this.status = 303;
                this.redirectHeader = "/notfound"+this.pageInfo.requireLevel+"a"+this.session.requireLevel;
            } else {
                this.status = 200;
            }

            if (this.pageInfo.pageData) {
                this.pageData = {};
                for (let key in this.pageInfo.pageData) {
                    this.pageData[key] = await eval(this.pageInfo.pageData[key]);
                }
            }
        }

        return this;
    }
}

async function get(page) {
    return new Data(page).load();
}

module.exports = {
    get,
};
