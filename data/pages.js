module.exports = {
    "/index": {
        title: "Dupbit - Home",
        currentPage: "index"
    },
    "/welcome": {
        currentPage: "welcome",
        requireLogin: true
    },
    "/register": {
        title: "Dupbit - Register",
        currentPage: "register",
        requireLogout: true,
        //errorCode = GET["fail"] ? GET["fail"] : 0
        //errorMessageList = decodeErrorCude(errorCode)
    },
    notfound: {

    }
};
