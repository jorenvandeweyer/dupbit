const cookie = require('cookie');

function create(name, content, expires = 1000*60*60*24) {
    return `${name}=${JSON.stringify(content)}; expires=${new Date(Date.now() + expires).toUTCString()}; path=/`;
}

function remove(name) {
    return `${name}=""; max-age=-1; path=/`;
}

function parse(cookies) {
    cookies ? cookie.parse(cookies) : {};
}

module.exports = {
    create,
    remove,
    parse,
};
