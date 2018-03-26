const Data = require("./util/Data");
const Cookie = require("./util/Cookie");

class Api {
    constructor(url, request) {
        this.url = url;
        this.request = request;
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
            this.header["Location"] =  data.redirect;
            this.status = 303;
        } else {
            this.status = 200;
            this.content = data;
        }

        if (data && "cookie" in data) {
            this.header["Set-Cookie"] = data["cookie"];
        }

        if (data && data.backdirect) {
            this.status = 303;
            this.header["Location"] = this.request.headers.referer;
        }

        return this;
    }
}

async function get(url, request) {
    return new Api(url, request).load();
}

module.exports = {
    get
};
