const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require('./database');
const privateKey = fs.readFileSync(`${process.env.CERTS_PATH}/private.key`, 'utf8');
const publicKey = fs.readFileSync(`${process.env.CERTS_PATH}/public.key`, 'utf8');

module.exports = async (req, res, next) => {
    res.createToken = createToken;
    res.simpleToken = simpleToken;
    req.checkToken = checkToken;
    req.auth = await decode(req, res);
    next();
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

        if (decoded.toe*1000 < Date.now()) {
            const token = await db.Tokens.findByPk(decoded.jti);

            const newToken = await token.refresh();
            if (!token) return false;
            
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
                if (this.cuser) return this.cuser;
                this.cuser = await db.Users.findByPk(this.uid);
                return this.cuser;
            },
            destroy: async function() {
                res.clearCookie('sid', {
                    domain: '.dupbit.com',
                    secure: true
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

    if (obj.cookie) 
        this.cookie('sid', string, {
            maxAge: token.get().exp - token.get().iat,
            secure: true,
            domain: '.dupbit.com',
            httpOnly: true,
        });

    return {
        token: {
            ...token.get(),
            upm: obj.user.get().permissions,
        },
        string,
    };
}
