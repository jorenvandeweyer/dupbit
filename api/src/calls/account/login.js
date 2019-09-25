const express = require('express');
const db = require('../../database');

module.exports = express.Router()
    .post('/', async (req, res) => {
        const data = req.body;

        if (!data.username || !data.password) 
            return res.errors.incomplete();

        const user = await findUser(data.username);

        if (!user) return res.errors.wrongCredentials();

        if (! await user.matchPassword(data.password, {req}))
            return res.errors.wrongCredentials();
        
        if (user.get().permissions === 0)
            return res.errors.custom({
                reason: 'Must verify email first',
            });

        const result = await res.createToken({user, cookie: true});
        
        res.jsons({
            ...result,
            user: user.safe,
        });
    });

async function findUser(username) {
    if (username.includes('@')) {
        return await db.Users.findOne({where: {email: username}});
    } else {
        return await db.Users.findOne({where: {username}});
    }
}
