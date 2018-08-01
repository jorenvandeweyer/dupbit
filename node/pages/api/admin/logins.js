const db = require("../../../src/util/Database");

module.exports = async (req, res) => {
    const data = req.query;

    if (req.auth.isLoggedIn && req.auth.level >= 3) {
        const logins = await getLoginAttempts(data.before, data.number);
        res.json({
            success: true,
            logins,
        });
    } else {
        res.status(405).json({
            success: false,
            reason: "not authorized",
        });
    }
};

async function getLoginAttempts(before, number=100) {
    if (before) {
        return await db.getLoginAttemptsBefore(before, number);
    } else {
        return await db.getLoginAttempts(number);
    }
}
