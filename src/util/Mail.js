const MailComposer = require('nodemailer/lib/mail-composer');
const { mailgun_api_key } = require("../../config.json");
const domain = 'dupbit.com';

const mailgun = require('mailgun-js')({apiKey: mailgun_api_key, domain: domain});

// var data = {
//     from: 'noreply <noreply@dupbit.com>',
//     to: 'jorenvandeweyer@gmail.com',
//     subject: 'Hello',
//     text: 'Testing some Mailgun awesomeness!'
// };

// mailgun.messages().send(data, function (error, body) {
//     console.log(body);
// });

async function send(from, to, subject, html) {
    let data = {
        from,
        to,
        subject,
        html,
    };

    let mail = new MailComposer(data);
    return new Promise((resolve, reject) => {
        mail.compile().build((err, message) => {
            if (err) return reject(err);

            let dataToSend = {
                to,
                message: message.toString('ascii'),
            };

            mailgun.messages().sendMime(dataToSend, (sendError, body) => {
                if (sendError) return reject(sendError);
                resolve(body);
            });
        });
    });
}

async function register(email, id, username, hash) {
    return await send("noreply@dupbit.com", email, `Welcome to Dupbit! Confirm your email ${username}!`, `
<!DOCTYPE html>
<html lang="en"
<html>
<head>
<title>Confirm Email</title>
</head>
<body>
<a href=https://dupbit.com/api/validate?id=${id}&hash=${hash}>Activate account</a>
</body>
</html>
    `);
}

module.exports = {
    send,
    register
};
