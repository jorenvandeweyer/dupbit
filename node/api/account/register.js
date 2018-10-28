const Database = require("../../src/util/Database");
const verifyUser = require("../../src/util/verifyUser");
const bcrypt = require("bcrypt");
const Mail = require("../../src/util/Mail");

module.exports = async (req, res) => {
    const data = req.body;

    if (!data.username || !data.password || !data.confirmpassword || !data.email)
        return res.errors.incomplete();
    
    const errorCode = await verifyUser.verifyRegistration(data.username, data.password, data.confirmpassword, data.email);

    if (errorCode !== 0) return res.redirect(`/register?fail=${errorCode}`);

    const hash = await bcrypt.hash(data.password, 10);
    const emailhash = await bcrypt.hash(hash, 10);

    await Database.register(data.username, hash, data.email);

    const id = await Database.getIDByUsername(data.username);
    
    await Database.addUsernameChange(id, data.username);

    res.redirect("/index");

    await Mail.sendTemplate({
        subject: `Welcome to Dupbit! Confirm your email ${data.username}!`,
        sender: "noreply@dupbit.com",
        receiver: data.email,
        title: `Welcome to Dupbit! Confirm your email ${data.username}!`,
        message_title: "Thanks for registering at Dupbit!",
        message_content: "To complete your registration click the button below. If you did not register to Dupbit, you can just ignore this email.",
        button_title: "Confirm Email",
        button_url: `https://dupbit.com/api/account/validate?id=${id}&hash=${emailhash}`,
    });
};
