const http = require("http");
const ua_parser = require("ua-parser");

const Url = require("./src/util/Url");
const handler = require("./src/handler");
const api = require("./src/api");
const WebSocket = require("./src/websocket/index");

process.on("unhandledRejection", (reason, p) => {
    /*eslint no-console: 0*/
    console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
    // application specific logging, throwing an error, or other logic here
});

let server = http.createServer(async (request, response) => {
    request.ua_os = ua_parser.parse(request.headers["user-agent"]);
    if (request.url.includes("/api/") || request.method === "POST") {
        let body = "";

        request.on("data", (data) => {
            body += data;
        });

        request.on("end", async () => {
            let url;
            if (request.method === "GET" && request.url.includes("?")) {
                url = new Url(request.url.replace("?", ".js?"));
            } else {
                url = new Url(`${request.url.replace("?", "")}.js?${body}`);
            }
            let answer = await api.get(url, request);
            response.writeHead(answer.status, answer.header);

            if (answer.json) {
                response.end(JSON.stringify(answer.content));
            } else {
                response.end(answer.content, "binary");
            }
        });
    } else if (request.method === "GET") {
        const url = new Url(request.url);
        let page = await handler.get(url, request);

        response.writeHead(page.status, page.header);

        response.write(page.content);
        response.end();
        //response.end(content, 'utf-8');
    } else {
        console.log("ELSE???????");
        // console.log(request);
    }
}).listen(8080);

WebSocket.create(server);
