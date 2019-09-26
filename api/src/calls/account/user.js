const express = require('express');
const db = require('../../database');
const mail = require('../../utils/mail');
const validate = require('../../utils/validateUser');

module.exports = express.Router()
    .post('/', async (req, res) => {
        const data = req.body;

        const error = await validate.registration(data);
        if (error) return res.jsonf({
            errors: validate.getErrorMessage(error),
        });

        try {
            const user = await db.Users.create({
                username: data.username,
                email: data.email,
                password: data.password,
            }, {req});

            res.jsons({user: user.safe});

            verificationMail(user, res);
        } catch(e) {
            res.errors.db(e);
        }
    })
    .use((req, res, next) => {
        if (!req.auth) return res.errors.needAuth();
        next();
    })
    .get('/', async (req, res) => {
        const user = await req.auth.user();
        res.jsons(user.safe);
    })
    .put('/', async (req, res) => {
        const data = req.body;

        try {
            if (data.password && data.password_new) 
                return changePassword(req, res);
            if (data.username)
                return changeUsername(req, res);
        } catch(e) {
            res.errors.db(e);
        }

        return res.errors.incomplete();
    })
    .delete('/', async (req, res) => {
        const data = req.body;
        const user = await req.auth.user();
        if (!data.password) return res.errors.incomplete();

        const match = await user.matchPassword(data.password, {req});
        if (!match) return res.errors.wrongCredentials();

        await req.auth.destroy();
        await user.destroy();

        res.jsons();
    });

async function verificationMail(user, res) {
    const token = await res.simpleToken({
        user: user,
    });

    mail.send({
        from: 'Dupbit <noreply@dupbit.com>',
        to: user.email,
        subject: `Dupbit | Welcome ${user.get().username}`,
        // text: `https://api.${process.env.HOST}/account/verify?token=${token.string}`,
        html: await mail.html('default', {
            title: 'Active your account',
            message_title: 'Active your account',
            message_content: `Hello ${user.get().username}, welcome to Dupbit!`,
            button_url: `https://api.${process.env.HOST}/account/verify?token=${token.string}`, 
            button_title: 'Active your account'
        })
    });
}

async function changePassword(req, res) {
    const data = req.body;
    const user = await req.auth.user();

    if (!await user.matchPassword(data.password, {req})) 
        return res.errors.wrongCredentials();

    const error = await validate.password(data.password_new);
    if (error) return res.jsonf({
        errors: validate.getErrorMessage(error),
    });

    await user.update({
        password: data.password_new,
    }, {req});
    
    res.jsons(user.save);

    mail.send({
        from: 'Dupbit <noreply@dupbit.com>',
        to: user.email,
        subject: 'Dupbit| Password changed',
        text: 'Your password got changed',
    });
}

async function changeUsername(req, res) {
    const data = req.body;
    const user = await req.auth.user();

    const error = await validate.username(data.username);
    if (error) return res.jsonf({
        errors: validate.getErrorMessage(error),
    });

    await user.update({
        username: data.username
    }, {req});

    res.jsons(user.save);

    mail.send({
        from: 0
    });
}

