const http = require('http');
const Url = require("./src/util/Url");
const handler = require("./src/handler");

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

http.createServer(async (request, response) => {
    const url = new Url(request.url);
    let page = await handler.get(url, request);

    response.writeHead(page.status, page.data);

    response.write(page.content);
    response.end();
    //response.end(content, 'utf-8');
}).listen(8125);

console.log('Server running at http://127.0.0.1:8125/');
