const express = require("express");
const ua_parser = require("ua-parser");
const Cookie = require("./src/util/Cookie");
// const WebSocket = require("./src/websocket/index");
const auth = require("./src/auth");
const api = require("./src/api");
const html = require("./src/html");

process.on("unhandledRejection", (reason, p) => {
    /*eslint no-console: 0*/
    console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
    // application specific logging, throwing an error, or other logic here
});

const app = express();

app.use((req, res, next) => {
    if (!req.locals) req.locals = {};

    req.ua_os = ua_parser.parse(req.headers["user-agent"]);
    req.cookies = Cookie.parse(req.headers.cookie);
    next();
});

app.use("*", auth);
app.use("/api", api);
app.use("*", html);

app.listen(8080, () => console.log(8080));


// WebSocket.create(app);
