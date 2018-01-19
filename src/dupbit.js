const settings = require("../config.json");
const mysql = require("mysql");

const con = mysql.createConnection({
    host: settings.MYSQL_HOST,
    user: settings.MYSQL_USER,
    password: settings.MYSQL_PASSWORD,
    database: settings.MYSQL_DATABASE
});

con.connect((err) => {
    if(err) throw err;
    console.log("DATABASE CONNECTED");
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

function getLevelByID(fun){
    return 3;
}

function evalFun(script) {
    return eval(script);
}

module.exports = {
    evalFun
};
