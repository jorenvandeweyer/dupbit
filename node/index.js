const http = require("http");
const express = require("express");
const cors = require("cors");
const WebSocket = require("./src/websocket/index");

const bodyParser = require("body-parser");

const Cookie = require("./src/util/Cookie");

const auth = require("./src/auth");
const api = require("./src/api");
const html = require("./src/html");
const errors = require("./src/errors");

require("./src/cron");
require("./src/util/mqtt");

process.on("unhandledRejection", (reason, p) => {
    /*eslint no-console: 0*/
    console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});

const app = express();

app.disable("x-powered-by");

app.options("*", cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (!req.locals) req.locals = {};

    req.cookies = Cookie.parse(req.headers.cookie);
    next();
});

app.use("*", errors);
app.use("*", auth);
app.use("/ics", express.static("pages/ics"));
app.use("/api", api);
app.use("*", html);

const server = http.createServer(app);
server.listen(8080);

WebSocket.create(server);

console.log(`Running in: ${process.env.NODE_ENV}`);
