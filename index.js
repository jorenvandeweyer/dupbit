const https = require('https');
const http = require('http');
const fs = require("fs");

const Url = require("./src/util/Url");
const handler = require("./src/handler");
const api = require("./src/api");
const WebSocket = require("./src/websocket/index");

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

const options = {
  key: fs.readFileSync('data/secrets/dupbit.com/privkey.pem'),
  cert: fs.readFileSync('data/secrets/dupbit.com/fullchain.pem')
};

let server = https.createServer(options, async (request, response) => {
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
                url = new Url(`${request.url}.js?${body}`);
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
        console.log(request);
    }
}).listen(443);

http.createServer(function (req, res) {
    console.log(req);
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);

// WebSocket.create(server);

console.log('Server running at http://127.0.0.1:443/');
