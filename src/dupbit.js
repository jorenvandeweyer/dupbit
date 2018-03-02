const settings = require("../config.json");
const mysql = require("mysql");
const bcrypt = require('bcrypt');

const con = mysql.createConnection({
    host: settings.MYSQL_HOST,
    user: settings.MYSQL_USER,
    password: settings.MYSQL_PASSWORD,
    database: settings.MYSQL_DATABASE
});

con.connect((err) => {
    if(err) throw err;
    // console.log("DATABASE CONNECTED");
});

function getUsernameByID(fun){
    console.log(fun);
    return fun;
}

function getLogin(){
    return "BRUHHH";
}

function isLoggedIn(){
    return false;
}

function getLevelByID(id) {
    const query = ""
    con.query("SELECT level FROM users WHERE id=?", [id], (err, result) => {

    });
    return 3;
}

function evalFun(script) {
    return eval(script);
}

module.exports = {
    evalFun
};

async function getPasswordByID(id) {
    return new Promise((resolve, reject) => {
        con.query("SELECT password FROM users WHERE id=?", [id], (err, result) => {
            if (err) reject(err);
            if (result.length) {
                resolve(result[0].password);
            } else {
                resolve(null);
            }
        });
    });
}

async function getIDByUsername(username) {
    return new Promise((resolve, reject) => {
        con.query("SELECT id FROM users WHERE username=?", [username], (err, result) => {
            if (err) reject(err);
            if (result.length) {
                resolve(result[0].id);
            } else {
                resolve(null);
            }
        });
    });
}

async function verifyLogin(username, password) {
    let id = await getIDByUsername(username);
    let hash = await getPasswordByID(id);

    console.log(hash, password);

    if(bcrypt.compareSync(password, hash.replace("$2y$", "$2a$"))) {
        console.log("match");
    } else {
        console.log("reject");
    }
}

// let hash = bcrypt.hashSync('joren123', 10);
