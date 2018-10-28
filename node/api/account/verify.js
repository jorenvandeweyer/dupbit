const verifyUser = require("../../src/util/verifyUser");

module.exports = async (req, res) => {
    const data = req.body;

    if ("username" in data && "password" in data && "confirmpassword" in data && "email" in data) {
        let usernameErrorCode = await verifyUser.verifyUsername(data.username);
        let passwordErrorCode = verifyUser.verifyPassword(data.password);
        let confirmPasswordErrorCode = verifyUser.verifyPasswordMatch(data.password, data.confirmpassword);
        let emailErrorCode = await verifyUser.verifyEmail(data.email);

        let usernameError = verifyUser.decodeErrorCode(usernameErrorCode).join(" ");
        let passwordError = verifyUser.decodeErrorCode(passwordErrorCode).join(" ");
        let confirmPasswordError = verifyUser.decodeErrorCode(confirmPasswordErrorCode).join(" ");
        let emailError = verifyUser.decodeErrorCode(emailErrorCode).join(" ");

        res.json({
            username: usernameError,
            password: passwordError,
            confirmpassword: confirmPasswordError,
            email: emailError
        });
    }
};
