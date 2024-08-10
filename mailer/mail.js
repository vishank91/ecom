const nodeMailer = require("nodemailer")

const transporter = new nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    tls: true,
    auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASSWORD
    }
})
function sendMailText(to, subject, message) {
    let mailOptions = {
        from: process.env.MAIL_SENDER,
        to: to,
        subject: subject,
        text: message
    }
    transporter.sendMail(mailOptions, (error) => {
        console.log(error)
    })
}
function sendMailHtml(to, subject, message) {
    let mailOptions = {
        from: process.env.MAIL_SENDER,
        to: to,
        subject: subject,
        html: message
    }
    transporter.sendMail(mailOptions, (error) => {
        console.log(error)
    })
}

module.exports = {
    sendMailText,
    sendMailHtml
}