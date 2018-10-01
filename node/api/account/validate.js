const Database = require("../../src/util/Database");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
    const data = req.query;

    if (data.id && data.hash) {
        const id = data.id;
        const hash = data.hash;

        const passwordHash = await Database.getPasswordByID(id);
        const notActivated = await Database.getLevelByID(id) === 0;

        if (passwordHash && bcrypt.compareSync(passwordHash, hash) && notActivated) {
            await Database.setLevel(id, 1);
            return res.redirect("/login");
        }
    }
    res.redirect(303, "/notauthorized");
};
