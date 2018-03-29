const IP = require("../../src/util/IP");

async function resolve(data, apidata) {
    return {
        ip: IP.extract(apidata.request),
    };
}

module.exports = {
    resolve,
};
