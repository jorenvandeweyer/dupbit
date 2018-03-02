const Session = require('express-session');
// const Dupbit = require("../dupbit");
const Database = require("./Database");

class Data {
    constructor(page) {
        this.page = page;
    }

    async load() {
        this.status = 200;
    }
}

async function get(page) {
    return new Data(page).load();
}

module.exports = {
    get
};
