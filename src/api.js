const Data = require("./util/Data");
const Cookie = require("./util/Cookie");
const Token = require("./util/Token");
const User = require("./util/User");

class Api {
    constructor(url, request) {
        this.url = url;
        this.request = request;
        this.cookies = Cookie.parse(request.headers.cookie);
        this.header = {
            "Content-Type": 'application/json'
        };
    }

    async authenticate() {
        let decoded = Token.verifyToken(this.cookies["sid"]);

        if (decoded) {
            this.session = decoded.data;
            this.user = await new User(this.session.id).load();
        } else {
            this.session = {
                isLoggedIn: false,
            };
            this.user = User.nullUser();
        }
    }

    async load() {
        await this.authenticate();
        const api_call = require(this.url.fullAPIPath);
        let data = await api_call.resolve(this.url.url.query, this);

        if (data && "redirect" in data) {
            if (!data.redirect.includes("http")) {
                data.redirect = "/" + data.redirect;
            }
            this.header["Location"] =  data.redirect;
            if ("status" in data) {
                this.status = data.status;
            } else {
                this.status = 303;
            }
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
