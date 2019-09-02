const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require('../database');

const privateKey = fs.readFileSync('/etc/certs/private.key', 'utf8');
const publicKey = fs.readFileSync('/etc/certs/public.key', 'utf8');

module.exports = class Token {
    constructor(token) {
        if (typeof token === 'string') {
            this.token = token;
        } else if (typeof token === 'object') {
            this.user = token;
        } else {
            this.token = false;
        }
    }

    async create(req) {
        //insert in db
        this.expires = req.expires ? parseInt(req.expires) : 365*10*24*60*60;
        // const ip = req.get('x-real-ip');
        this.token = jwt.sign({
            tid: 0, //tid from db
            uid: this.user._id,
            exp: Math.floor(Date.now() / 1000) + this.expires,
        }, privateKey, {algorithm: 'RS256'});
        await this.verify();
    }

    async verify() {
        try {
            this.decoded = jwt.verify(this.token, publicKey, {algorithm: 'RSA256'});
            if (this.user) return true;
            this.user = await db.Users.findById(this.decoded.uid);
            if (!this.user) throw 'user not in db';
            return true;
        } catch(e) {
            this.decoded = false;
            if (e.name === 'TokenExpiredError') {
                return false;
            }
            return false;
        }
    }
};
