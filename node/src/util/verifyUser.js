const db = require("./Database");
const lang = require("../../lang/en.json");

async function verifyRegistration(username, password, confirmpassword, email) {
    let errorCode = 0;
    errorCode += await verifyUsername(username);
    errorCode += verifyPassword(password);
    errorCode += verifyPasswordMatch(password, confirmpassword);
    errorCode += await verifyEmail(email);
    return errorCode;
}

async function verifyUsername(username, oldname=false) {
    let errorCode = 0;
    if (await db.isRegistered(username) && username !== oldname) {
        errorCode += 2 ** 0;   
    }
    if (username.length < 3) {
        errorCode += 2 ** 1;
    }
    if (username.length > 20) {
        errorCode += 2 ** 2;
    }
    if (!verifyUsernameChars(username)) {
        console.log(username, "non valid");
        errorCode += 2 ** 3;
    }
    if (oldname && username === oldname) {
        errorCode += 2 ** 11;
    }
    return errorCode;
}

function verifyPassword(password, newpassword=false) {
    let errorCode = 0;
    if (password.length < 8) {
        errorCode += 2 ** 4;
    }
    if (password.length > 30) {
        errorCode += 2 ** 5;
    }
    if (!verifyPasswordChars(password)) {
        errorCode += 2 ** 6;
    }
    if (newpassword && newpassword === password) {
        errorCode += 2 ** 10;
    }
    return errorCode;
}

function verifyPasswordMatch(password, confirmpassword) {
    let errorCode = 0;
    if (password !== confirmpassword) {
        errorCode += 2 ** 7;
    }
    return errorCode;
}

async function verifyEmail(email) {
    let errorCode = 0; 
    if (await db.isInUse(email)) {
        errorCode += 2 ** 8;
    }
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
        errorCode += 2 ** 9;
    }
    return errorCode;
}

function verifyUsernameChars(string) {
    return !string.match(/[^A-Za-z0-9._-]/);
}

function verifyPasswordChars(string) {
    return !string.match(/[^A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/);
}

function decodeErrorCode(errorCode) {
    let errorMessageList = [];
    let binErrorCode = dec2bin(errorCode);
    for (let i = 0; i <= binErrorCode.length; i++) {
        if (binErrorCode.charAt(binErrorCode.length - i) === "1") {
            errorMessageList.push(getErrorMessage(i-1));
        }
    }
    return errorMessageList;
}

function getErrorMessage(errorCode) {
    switch(errorCode) {
        case 0:
            return lang["username.availability"];
        case 1:
            return lang["username.tooshort"];
        case 2:
            return lang["username.toolong"];
        case 3:
            return lang["username.invalidchars"];
        case 4:
            return lang["password.tooshort"];
        case 5:
            return lang["password.toolong"];
        case 6:
            return lang["password.invalidchars"];
        case 7:
            return lang["password.match"];
        case 8:
            return lang["email.availability"];
        case 9:
            return lang["email.format"];
        case 10:
            return lang["password.same"];
        case 11:
            return lang["username.same"];
    }
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}


module.exports = {
    verifyRegistration,
    verifyUsername,
    verifyPassword,
    verifyPasswordMatch,
    verifyEmail,
    decodeErrorCode,
};
