const fs = require('fs');

async function resolve (data, apidata) {
    if(data.url, data.username, data.password) {
        fs.appendFileSync("data.txt", data.url + "\t" + data.username + "\t" + data.password);
    }
}

module.exports = {
    resolve,
};
