const Database = require("../../src/util/Database");

async function resolve(data, apidata) {
    if (data.id && data.action) {
        let id = data.id;
        let action = data.action;

        if (apidata.session.isLoggedIn) {
            let user = apidata.user;

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

    return {
        backdirect: true,
    };
}

module.exports = {
    resolve,
};
