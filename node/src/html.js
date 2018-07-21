const Url = require("./util/Url");
const Cache = require("./util/Cache");
const PageInfo = require("../data/pages");
const ejs = require("ejs");
const lang = require("../lang/en.json");

const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".ics": "text/calendar",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".mp3": "audio/mpeg",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".svg": "image/svg+xml",
    ".ejs": "text/html",
    ".ico": "image/x-icon",
};

const cache = new Cache();

module.exports = async (req, res) => {
    const url = new Url(req.originalUrl);
    res.set("Content-Type", mimeTypes[url.ext]);
    // const lang = require("../../lang/en.json");

    let pageInfo = PageInfo[url.pathname];

    if (pageInfo == undefined) {
        pageInfo = {
            title: "Dupbit",
        };
    }

    req.locals.pageInfo = pageInfo;
    req.locals.session = req.auth;
    req.locals.query = url.query;
    req.locals.lang = lang;
    
    if (pageInfo.requireLogout && req.auth.isLoggedIn) {
        return res.redirect(303, "/welcome");
    } else if (pageInfo.requireLogin && !req.auth.isLoggedIn) {
        return res.redirect(303, `/login?redirect=${pageInfo.currentPage}`);
    } else if (pageInfo.requireLevel && pageInfo.requireLevel > req.auth.level) {
        return res.redirect(303, "/notfound");
    }

    let content = await cache.get(url);

    if (content) {
        if (url.ext === ".ejs") {
            content = await ejs.render(content, req.locals, {filename: url.fullPath});
        }
        res.send(content);
    } else {
        res.set("Content-Type", mimeTypes[".ejs"]);
        content = await cache.get(new Url("/notfound"));
        content = await ejs.render(content, req.locals, {filename: url.fullPath});
        res.status(404).send(content);
    }
};
