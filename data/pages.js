module.exports = {
    "/index": {
        title: "Dupbit - Home",
        currentPage: "index"
    },
    "/welcome": {
        title: "Dupbit - Welcome",
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
    "/login": {
        title: "Dupbit - Login",
        currentPage: "login",
        requireLogout: true,
        // redirect: "welcome"
        //$redirect = isset($_GET["redirect"]) ? $_GET["redirect"] : "welcome";
        //$fail = isset($_GET["fail"]);
        //$notActivated = isset($_GET["notActivated"]);
    },
    "/users": {
        title: "Dupbit - Users",
        currentPage: "users",
        requireLogin: true,
        requireLevel: 3,
        pageData: {
            "users": "Database.getUsers()",
        }
    },
    "/dupbot": {
        title: "Dupbit - Dupbot",
        currentPage: "dupbot",
        metaKeywords: "Dupbot, Discord, Bot, Discordbot",
        metaDescription: "Dupbot the bot for you Discord server.",
    },
    "/notfound": {
        title: "Dupbit - Not Found",
        currentPage: "notfound",
    },
    "/not_authorized": {
        title: "Dupbit - Not Authorized",
        currentPage: "not_authorized",
    },
    "/logins": {
        title: "Dupbit - Logins",
        currentPage: "logins",
        requireLogin: true,
        requireLevel: 3,
        pageData: {
            "attempts": "Database.getLoginAttempts()",
        }
    },
};
