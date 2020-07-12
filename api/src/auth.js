/* eslint-disable require-atomic-updates */
const jwt = require('jsonwebtoken');
const db = require('./database');

const privateKey = process.env.KEY_PRIVATE.replace(/\\n/gm, '\n');
const publicKey = process.env.KEY_PUBLIC.replace(/\\n/gm, '\n');

module.exports = async (req, res, next) => {
    if (typeof next === 'function') {
        res.createToken = createToken;
        res.simpleToken = simpleToken;
        req.checkToken = checkToken;
        req.auth = await decode(req, res);

        next();
    } else {
        return await decode(req, res);
    }
};

function checkToken(string) {
    try {
        return jwt.verify(string, publicKey, {algorithm: 'RS256'});
    } catch(e) {
        return false;
    }
}

function simpleToken(obj={user: false}) {
    const uid = (typeof obj.user === 'object') ? obj.user.get().id : obj.user;

    const token = {
        uid,
        exp: Math.floor(Date.now()/1000) + 7*24*60*60
    };

    const string = jwt.sign(token, privateKey, {algorithm: 'RS256'});

    return {
        token,
        string,
    };
}

async function decode(req, res) {
    const string = req.headers.authorization || req.cookies.sid;
    if (!string) return false;

    try {
        let decoded = jwt.verify(string, publicKey, {algorithm: 'RS256'});

        if (!decoded) return false;

        // if toe has passed validate token by checking db
        // if token does not exists anymore session invalidated
        // if token exists a new token is sended to skip this function
        // untill next toe (faster) but not required
        if (decoded.toe*1000 < Date.now() && res) {
            const token = await db.Tokens.findByPk(decoded.jti);

            if (!token) return false;
            const newToken = await token.refresh();

            const result = await res.createToken({
                token: newToken,
                cookie: true,
            });

            decoded = result.token;
        }

        return {
            ...decoded,
            raw: function() {
                return string;
            },
            hasPermissions: function(...perm) {
                return db.Users.checkPermissions(this.upm, ...perm);
            },
            user: async function() {
                if (this._user) return this._user;
                this._user = await db.Users.findByPk(this.uid);
                return this._user;
            },
            destroy: async function() {
                res.clearCookie('sid', {
                    domain: process.env.HOST,
                    secure: process.env.NODE_ENV === 'production',
                });
                return await db.Tokens.destroy({where: {jti: this.jti}});
            }
        };
    } catch (e) {
        return false;
    }
}

async function createToken(obj={cookie: false, token: false, user: false}) {
    if (obj.token)
        obj.user = obj.token.uid;

    if (typeof obj.user !== 'object')
        obj.user = await db.Users.findByPk(obj.user);

    const token = obj.token || (await obj.user.createToken());

    const string = jwt.sign({
        ...token.seconds,
        upm: obj.user.get().permissions,
    }, privateKey, {algorithm: 'RS256'});

    if (obj.cookie) {
        this.cookie('sid', string, {
            maxAge: token.get().exp - token.get().iat,
            secure: process.env.NODE_ENV === 'production',
            domain: process.env.HOST,
            httpOnly: true,
        });
    }


    return {
        token: {
            ...token.get(),
            upm: obj.user.get().permissions,
        },
        string,
    };
}
