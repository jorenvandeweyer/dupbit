async function resolve(data, apidata) {
    if (apidata.session.isLoggedIn) {
        return {
            success: true,
            custom: true,
            headers: {
                "Access-Control-Allow-Origin": apidata.request.headers.origin ? apidata.request.headers.origin : `chrome-extension://${data.origin}`,
                "Access-Control-Allow-Credentials": "true",
            },
            data: apidata.session,
        };
    } else {
        return {
            success: true,
            custom: true,
            headers: {
                "Access-Control-Allow-Origin": apidata.request.headers.origin ? apidata.request.headers.origin : `chrome-extension://${data.origin}`,
                "Access-Control-Allow-Credentials": "true",
            },
            data: apidata.session,
        };
    }
}

module.exports = {
    resolve,
};