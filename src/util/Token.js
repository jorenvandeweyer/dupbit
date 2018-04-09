const jwt = require('jsonwebtoken');
const NodeRSA = require('node-rsa');
const fs = require('fs');

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

function createToken(data, expire=60*60*24) { //expire=1day
    return jwt.sign({
        data,
        exp: Math.floor(Date.now() / 1000) + expire
    }, privateKey, {algorithm: "RS256"});
}

function verifyToken(token) {
    try {
        return jwt.verify(token, publicKey, {algorithm: "RS256"});
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

module.exports = {
    createToken,
    verifyToken,
};
