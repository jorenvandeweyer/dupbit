const Token = require("./util/Token");
const Database = require("./util/Database");
const User = require("./util/User");

module.exports = async (req, res, next) => {
    const decoded = await Token.verifyToken(req.headers.authorization || req.cookies.sid);
    if (decoded) {
        const id = decoded.data.id;
        req.auth = {
            ...decoded.data,
            username: await Database.getUsernameByID(id),
            level: await Database.getLevelByID(id)
        };
        req.locals.user = await new User(id).load();
    } else {
        req.auth = {
            isLoggedIn: false
        };
        req.locals.user = User.nullUser();
    }

    next();
};
