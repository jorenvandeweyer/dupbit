const db = require('../database');

const errorMessages = {
    'username.used': 1 << 0,
    'username.tooshort': 1 << 1,
    'username.toolong': 1 << 2,
    'username.invalidchars': 1 << 3,
    'username.same': 1 << 4,
    'password.tooshort': 1 << 5,
    'password.toolong': 1 << 6,
    'password.invalidchars': 1 << 7,
    'password.nomatch': 1 << 8,
    'email.used': 1 << 9,
    'email.format': 1 << 10,
    'username.required': 1 << 11,
    'email.required': 1 << 12,
    'password.required': 1 << 13,
};

module.exports = {
    email,
    password,
    username,
    registration,
    getErrorMessage,
};

async function registration(data) {
    let errorCode = 0;

    errorCode += await email(data.email);
    errorCode += await username(data.username);
    errorCode += password(data.password, data.confirmpassword);

    return errorCode;
}

async function username(username, oldname=false) {
    let errorCode = 0;

    if (!username) return errorMessages['username.required'];

    const user = await db.Users.findOne({where: {username}});

    if (user) errorCode += errorMessages['username.used'];
    if (username.length < 3) errorCode += errorMessages['username.tooshort'];
    if (username.length > 20) errorCode += errorMessages['username.toolong'];
    if (!usernameChars(username)) errorCode += errorMessages['username.invalidchars'];
    if (oldname && username === oldname) errorCode += errorMessages['username.same'];
    
    return errorCode;
}

function password(password, confirm=false) {
    let errorCode = 0;

    if (!password) return errorMessages['password.required'];

    if (password.length < 8) errorCode += errorMessages['password.tooshort'];
    if (password.length > 30) errorCode += errorMessages['password.toolong'];
    if (!passwordChars(password)) errorCode += errorMessages['password.invalidchars'];
    if (confirm && confirm !==  password) errorCode += errorMessages['password.nomatch'];

    return errorCode;
}

async function email(email) {
    let errorCode = 0;

    if (!email) return errorMessages['email.required'];
    
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const user = await db.Users.findOne({where: {email}});

    if (user) errorCode += errorMessages['email.used'];
    if (!re.test(email)) errorCode += errorMessages['email.format'];

    return errorCode;
}

function usernameChars(username) {
    return !username.match(/[^A-Za-z0-9._-]/);
}

function passwordChars(string) {
    return !string.match(/[^A-Za-z0-9! "#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/);
}

function checkBin(int, bin) {
    return !!(int & bin);
}

function getErrorMessage(errorCode) {
    const list = [];

    for (let error in errorMessages) {
        if (checkBin(errorCode, errorMessages[error])) {
            list.push(error);
        }
    }
    return list;
}
