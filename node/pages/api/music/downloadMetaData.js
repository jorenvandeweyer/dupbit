async function resolve (data, apidata) {
    if (apidata.session.isLoggedIn && data.id) {
        const id = data.id;
        return {
            success: true,
            download: JSON.stringify({
                id
            }),
            name: id + ".txt",
        };
    }
    return {
        success: false,
    };
}

module.exports = {
    resolve,
};
