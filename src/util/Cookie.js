function create(name, content, expires = 1000*60*60*24) {
    return `${name}=${JSON.stringify(content)}; expires=${new Date(Date.now() + expires).toUTCString()}; path=/`;
}

function remove(name) {
    return `${name}=""; max-age=-1; path=/`;
}

function parse(cookies) {
    let list = {};

    cookies && cookies.split(";").forEach((cookie) => {
        let parts = cookie.split("=");
        list[parts.shift().trim()] = JSON.parse(decodeURI(parts.join("=")));
    });
    return list;
}

module.exports = {
    create,
    remove,
    parse,
};
