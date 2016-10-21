let config = require('config')
let nodemailer = require('nodemailer')

let sender = config.get('mail.sender')
let transport = config.get('mail.transport')

class MailerEngine {

  sendPlain(to, subject, content) {

    let transporter = nodemailer.createTransport(transport)

    let message = {
      from: sender,
      to: to,
      subject: subject,
      text: content
    }

    return transporter.sendMail(message)
  }
}

module.exports = MailerEngine
