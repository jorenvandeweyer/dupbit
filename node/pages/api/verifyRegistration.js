const Database = require("../../src/util/Database");

async function resolve(data) {
    if ("username" in data && "password" in data && "confirmpassword" in data && "email" in data) {
        let usernameErrorCode = await Database.verifyUsername(data.username);
        let passwordErrorCode = Database.verifyPassword(data.password);
        let confirmPasswordErrorCode = Database.verifyPasswordMatch(data.password, data.confirmpassword);
        let emailErrorCode = await Database.verifyEmail(data.email);

        let usernameError = Database.decodeErrorCode(usernameErrorCode).join(" ");
        let passwordError = Database.decodeErrorCode(passwordErrorCode).join(" ");
        let confirmPasswordError = Database.decodeErrorCode(confirmPasswordErrorCode).join(" ");
        let emailError = Database.decodeErrorCode(emailErrorCode).join(" ");
        let errors = {
            "username": usernameError,
            "password": passwordError,
            "confirmpassword": confirmPasswordError,
            "email": emailError
        };
        return errors;
    }
}

module.exports = {
    resolve
};
