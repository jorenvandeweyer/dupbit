module.exports = {
    "/index": {
        title: "Dupbit - Home",
        currentPage: "/index"
    },
    "/beta": {
        title: "Dupbit - Beta",
        currentPage: "/beta"
    },
    "/welcome": {
        title: "Dupbit - Welcome",
        currentPage: "/welcome",
        requireLogin: true
    },
    "/contact": {
        title: "Dupbit - Contact",
        currentPage: "/contact",
    },
    "/register": {
        title: "Dupbit - Register",
        currentPage: "/register",
        requireLogout: true,
    },
    "/login": {
        title: "Dupbit - Login",
        currentPage: "/login",
        requireLogout: true,
    },
    "/users": {
        title: "Dupbit - Users",
        currentPage: "/users",
        requireLogin: true,
        requireLevel: 3,
    },
    "/dupbot": {
        title: "Dupbit - Dupbot",
        currentPage: "/dupbot",
        metaKeywords: "Dupbot, Discord, Bot, Discordbot",
        metaDescription: "Dupbot the bot for you Discord server.",
    },
    "/snitch": {
        title: "Dupbit - Snitch",
        currentPage: "/snitch",
        metaKeywords: "Snitch, Discord, Bot, Discordbot",
        metaDescription: "Word Notifications with emoji and regex support for your Discord server! 🎉.",
    },
    "/notfound": {
        title: "Dupbit - Not Found",
        currentPage: "/notfound",
    },
    "/notauthorized": {
        title: "Dupbit - Not Authorized",
        currentPage: "/notauthorized",
    },
    "/logins": {
        title: "Dupbit - Logins",
        currentPage: "/logins",
        requireLogin: true,
        requireLogout: false,
        requireLevel: 3,
    },
    "/projects/calendar/index": {
        title: "Dupbit - Calendar",
        currentPage: "/projects/calendar",
        requireLogin: true,
    },
    "/projects/music/index": {
        title: "Dupbit - Music",
        currentPage: "/projects/music",
        requireLogin: true,
        requireLevel: 2,
    },
    "/projects/connect/index": {
        title: "Dupbit - Connect",
        currentPage: "/projects/connect",
    },
    "/projects/connect/control": {
        title: "Dupbit - Connect Panel",
        currentPage: "/projects/connect/control",
        requireLogin: true,
        requireLevel: 2,
    },
    "/account/index": {
        title: "Dupbit - Account Settings",
        currentPage: "/account",
        requireLogin: true,
    },
    "/account/edit": {
        title: "Dupbit - Account Settings",
        currentPage: "/account/edit",
        requireLogin: true,
    },
    "/account/tokens": {
        title: "Dupbit - Account Settings",
        currentPage: "/account/tokens",
        requireLogin: true,
    },
};
