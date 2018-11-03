const verifyUser = require("../../src/util/verifyUser");

module.exports = async (req, res) => {
    const data = req.body;

    const response = {
        success: true,
    };

    if (data.username) {
        const errorCode = await verifyUser.verifyUsername(data.username);
        response.username = verifyUser.decodeErrorCode(errorCode);
    }
    if (data.password) {
        const errorCode = verifyUser.verifyPassword(data.password);
        response.password = verifyUser.decodeErrorCode(errorCode);
    }
    if (data.confirmpassword) {
        const errorCode = verifyUser.verifyPasswordMatch(data.password, data.confirmpassword);
        response.confirmpassword = verifyUser.decodeErrorCode(errorCode);
    }
    if (data.email) {
        const errorCode = await verifyUser.verifyEmail(data.email);
        response.email = verifyUser.decodeErrorCode(errorCode);
    }

    res.json(response);
};
