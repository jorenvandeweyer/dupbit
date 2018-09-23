const Token = require("./util/Token");
const Database = require("./util/Database");
const User = require("./util/User");

module.exports = async (req, res, next) => {
    const decoded = await Token.verifyToken(req.headers.authorization || req.cookies.sid);
    if (decoded) {
        const uid = decoded.uid;
        req.auth = {
            ...decoded,
            username: await Database.getUsernameByID(uid),
            level: await Database.getLevelByID(uid),
            isLoggedIn: true,
        };
        req.locals.user = await new User(uid).load();
    } else {
        req.auth = {
            isLoggedIn: false
        };
        req.locals.user = User.nullUser();
    }

    next();
};
