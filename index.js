const http = require('http');
const Url = require("./src/util/Url");
const handler = require("./src/handler");
const api = require("./src/api");
const url2 = require("url");

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

http.createServer(async (request, response) => {
    console.log(request.method);

    if (request.method == "GET") {
        const url = new Url(request.url);
        let page = await handler.get(url, request);

        response.writeHead(page.status, page.header);

        response.write(page.content);
        response.end();
        //response.end(content, 'utf-8');
    }
    if (request.method === "POST") {
        let body = "";

        request.on("data", (data) => {
            body += data;
        });

        request.on("end", async () => {
            const url = new Url(`${request.url}.js?${body}`);
            let answer = await api.get(url, request);

            response.writeHead(answer.status, answer.header);
            response.end(JSON.stringify(answer.content));
        });
    } else {
        console.log("ELSE???????");
    }
}).listen(8125);

console.log('Server running at http://127.0.0.1:8125/');
