const express = require('express');
const bodyParser = require('body-parser');
const cookie = require('cookie');

const router = require('./calls/router');

const db = require('./database');

const app = express();
const port = 8080;

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (!req.headers.cookie) {
        req.cookies = {};
        return next();
    }
    req.cookies = cookie.parse(req.headers.cookie);
    next();
});

app.use(require('./cors'));
app.use(require('./errors'));
app.use(require('./auth'));

app.use(router);

app.listen(port, () => console.log(`Running ${process.env.SERVER_ENV} in: ${process.env.NODE_ENV} on api.${process.env.HOST}:${port}`));
