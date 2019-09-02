const Token = require('./util/token');

module.exports = async (req, res, next) => {
    const token = new Token(req.headers.authorization || req.cookies.sid);
    await token.verify();

    if (token.decoded) {
        req.auth = token;
    } else {
        req.auth = false;
    }
    next();
};
