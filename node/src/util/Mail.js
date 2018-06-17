const MailComposer = require("nodemailer/lib/mail-composer");
const templates = require("./mail_templates/template.js");
const { mailgun_api_key } = require("../../config.json");
const domain = "dupbit.com";
const mailgun = require("mailgun-js")({apiKey: mailgun_api_key, domain: domain});

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
                message: message.toString("ascii"),
            };

            mailgun.messages().sendMime(dataToSend, (sendError, body) => {
                if (sendError) return reject(sendError);
                resolve(body);
            });
        });
    });
}


async function sendTemplate(obj) {
    return await send(obj.sender, obj.receiver, obj.subject, templates.create(obj));
}

module.exports = {
    send,
    sendTemplate,
};
