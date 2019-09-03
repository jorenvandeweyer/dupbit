const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const Url = require('url');
const compression = require('compression');

app.disable('x-powered-by');

app.set('view engine', 'ejs');

app.use(compression());
app.use(express.static(path.resolve('public'), {
    maxage: '3h',
    setHeaders: (res) => {
        res.setHeader('Expires', new Date(Date.now() + 1000*60*60*3).toUTCString());
    }
}));

app.get('*', (req, res) => {
    const url = Url.parse(req.url).pathname;
    res.render(`pages${url}`);
});

app.use((err, req, res) => {
    res.status(404).render('pages/notfound');
});

app.listen(port, () => console.log(`frontend app listening on ${process.env.HOST}:${port}!`));
