const jwt = require("jsonwebtoken");
const NodeRSA = require("node-rsa");
const fs = require("fs");
const db = require("./Database");

let privateKey, publicKey;

if (fs.existsSync("./data/secrets/private.key")) {
    privateKey = fs.readFileSync("./data/secrets/private.key", "utf8");
    publicKey = fs.readFileSync("./data/secrets/public.key", "utf8");
} else {
    console.log("[+]Generating keypair...");
    let key = new NodeRSA({b: 2048});
    privateKey = key.exportKey("pkcs1-private-pem");
    publicKey = key.exportKey("pkcs1-public-pem");
    console.log("[+]Keypair generated, savind...");
    fs.writeFileSync("./data/secrets/private.key", privateKey);
    fs.writeFileSync("./data/secrets/public.key", publicKey);
    console.log("[+]Keypair saved");
}

async function createToken(data, expire=60*60*24, info) { //expire=1day
    let result = await db.addToken(data.id, info.name, info.remote, info.ip);
    data.tid = result.insertId;
    return jwt.sign({
        data,
        exp: Math.floor(Date.now() / 1000) + expire
    }, privateKey, {algorithm: "RS256"});
}

async function verifyToken(token) {
    try {
        let decoded = jwt.verify(token, publicKey, {algorithm: "RS256"});
        let tokenId = await db.getToken({tid: decoded.data.tid});

        if (tokenId.length) {
            Object.assign(decoded.data, {
                device: tokenId[0].device,
                name: tokenId[0].name,
                ip: tokenId[0].ip
            });
            return decoded;
        }
    } catch(e) {
        // console.log(e);
        if(e.name === "TokenExpiredError") {
            console.log("TokenExpired");
            // return false;
        } else {
            // return false;
        }
    }
    return false;
}

function removeToken(tid) {
    db.removeToken(tid);
}

module.exports = {
    createToken,
    verifyToken,
    removeToken,
};
