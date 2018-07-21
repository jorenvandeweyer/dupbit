const Database = require("../../../src/util/Database");

module.exports = async (req, res) => {
    const data = req.query;

    if (data.id && data.action) {
        const id = data.id;
        const action = data.action;

        if (req.auth.isLoggedIn) {
            const user = req.locals.user;

            if (user.level === 3) {
                switch (action) {
                    case "update":
                        if (data.username) {
                            let username = data.username;
                            await Database.setUsername(id, username);
                            await Database.addUsernameChange(id, username);
                        }
                        if (data.email) {
                            await Database.setEmail(id, data.email);
                        }
                        if (data.level) {
                            await Database.setLevel(id, data.level);
                        }
                        break;
                    case "delete":
                        await Database.unregister(id);
                        break;
                    default:
                        break;

                }
            } else if (user.level > 0 && user.id === id) {
                switch (action) {
                    case "update":
                        if (data.username) {
                            await user.changeUsername(data.username);
                        }
                        if (data.email) {
                            await user.changeEmail(data.email);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
    res.redirect("back");
};
