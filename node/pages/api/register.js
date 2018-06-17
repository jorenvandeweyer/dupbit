const Database = require("../../src/util/Database");

async function resolve(data) {
    if ("username" in data && "password" in data && "confirmpassword" in data && "email" in data) {
        let errorCode = await Database.verifyRegistration(data.username, data.password, data.confirmpassword, data.email);

        if (errorCode === 0) {
            await Database.register(data.username, data.password, data.email);
            let id = await Database.getIDByUsername(data.username);
            await Database.addUsernameChange(id, data.username);
            return {
                redirect: "index"
            };
        } else {
            return {
                redirect: `register?fail=${errorCode}`
            };
        }
    }
}

module.exports = {
    resolve
};
