const http = require('http');
const Url = require("./src/util/Url");
const handler = require("./src/handler");

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
//test
http.createServer(async (request, response) => {

    const url = new Url(request.url);
    let page = await handler.get(url);

    response.writeHead(page.status, {"Content-Type": page.contentType});
    response.write(page.content);
    response.end();
    //response.end(content, 'utf-8');
}).listen(8125);

console.log('Server running at http://127.0.0.1:8125/');
