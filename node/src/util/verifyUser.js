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

async function verifyUsername(username) {
    let errorCode = 0;
    if (await db.isRegistered(username)) {
        errorCode += 2 ** 0;   
    }
    if (username.length < 3) {
        errorCode += 2 ** 1;
    }
    if (username.length > 20) {
        errorCode += 2 ** 2;
    }
    if (!verifyUsernameChars(username)) {
        errorCode += 2 ** 3;
    }
    return errorCode;
}

function verifyPassword(password) {
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
    let errorMessage;
    switch(errorCode) {
        case 0:
            errorMessage = lang["username.availability"];
            break;
        case 1:
            errorMessage = lang["username.tooshort"];
            break;
        case 2:
            errorMessage = lang["username.toolong"];
            break;
        case 3:
            errorMessage = lang["username.invalidchars"];
            break;
        case 4:
            errorMessage = lang["password.tooshort"];
            break;
        case 5:
            errorMessage = lang["password.toolong"];
            break;
        case 6:
            errorMessage = lang["password.invalidchars"];
            break;
        case 7:
            errorMessage = lang["password.match"];
            break;
        case 8:
            errorMessage = lang["email.availability"];
            break;
        case 9:
            errorMessage = lang["email.format"];
            break;
    }
    return errorMessage;
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
