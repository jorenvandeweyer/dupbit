const fs = require("fs");
const { getSong } = require("./downloadSong");

async function resolve(data, apidata) {
    if (apidata.session.isLoggedIn && apidata.session.level >= 2 && data.ytid) {
        const stream = await getSong(data.ytid);
        return {
            success: true,
            stream,
        };
    }
    return {
        success: false,
    };
}

module.exports = {
    resolve,
};
