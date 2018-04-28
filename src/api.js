const Data = require("./util/Data");
const Cookie = require("./util/Cookie");
const Token = require("./util/Token");
const User = require("./util/User");

class Api {
    constructor(url, request) {
        console.log(url);
        console.log("\n");
        console.log(request.headers);
        this.url = url;
        this.request = request;
        this.cookies = Cookie.parse(request.headers.cookie);
        this.json = true;
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
        const api_call = require(this.url.fullPath);
        let data = await api_call.resolve(this.url.query, this);

        if (data && "headers" in data) {
            for (let header in data.headers) {
                this.header[header] = data.headers[header];
            }
        }

        if (data && "redirect" in data && data.redirect) {
            if (!data.redirect.includes("http")) {
                data.redirect = "/" + data.redirect;
            }
            this.header["Location"] =  data.redirect;
            if ("status" in data) {
                this.status = data.status;
            } else {
                this.status = 303;
            }
        } else if (data && "download" in data) {
            this.status = 200;
            this.json = false;
            this.header['Content-disposition'] = `attachment; filename=${data.name}`;
            this.content = data.download;
            this.header['Content-Type'] = 'audio/mpeg';
        } else if (data && "stream" in data) {
            this.status = 200;
            this.json = false;
            this.header['Content-dispotition'] = `filname="stream.mp3"`;
            this.header['Content-length'] = `${data.stream.length}`;
            this.header['Cache-Control'] = "no-cache";
            this.header['Content-Transfer-Encoding'] = "chunked";
            this.content = data.stream;
        } else if (data && "custom" in data) {
            this.status = 200;
            this.content = data.data;
        } else {
            this.status = 200;
            this.content = data;
        }

        if (data && "cookie" in data) {
            this.header["Set-Cookie"] = data["cookie"];
        }

        if (data && data.backdirect && this.request.headers.referer) {
            this.status = 303;
            this.header["Location"] = this.request.headers.referer;
            if ("data" in data) {
                if (!this.header["Location"].includes("?")) this.header["Location"] += "?"
                for (let key in data.data){
                    this.header["Location"] += `&${key}`;
                    if (data.data[key]) {
                        this.header["Location"] += `=${data.data[key]}`
                    }
                }
            }
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
