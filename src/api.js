const Data = require("./util/Data");

class Api {
    constructor(url, request) {
        this.url = url;
        this.header = {
            "Content-Type": 'application/json'
        };
    }

    async load() {
        const api_call = require(this.url.fullAPIPath);
        let data = await api_call.resolve(this.url.url.query);

        if (data && "redirect" in data) {
            if (!data.redirect.includes("http")) {
                data.redirect = "/" + data.redirect;
            }
            this.header = {
                "Location": data.redirect
            };
            this.status = 303;
        } else {
            this.status = 200;
            this.content = data;
        }

        // this.status = 200;
        // this.content = data;


        return this;
    }
}

async function get(url, request) {
    return new Api(url, request).load();
}

module.exports = {
    get
};
