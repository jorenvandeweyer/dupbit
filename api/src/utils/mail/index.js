const mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_KEY, domain: process.env.MAIL});
const ejs = require('ejs');

async function html(file, fields) {
    const html = await ejs.renderFile(`${__dirname}/templates/${file}.ejs`, fields, {async: true});
    return html;
}

async function send(data) {
    return new Promise((resolve, reject) => {
        mailgun.messages().send(data, (err, body) => {
            if (err) reject(err);
            resolve(body);
        });
    });
}

module.exports = {
    send,
    html,
    Attachment: mailgun.Attachment,
};
