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

  invite(data) {
    let app = config.get('app')
    let email = data.email
    let password = data.password
    let endpoint = app.protocol + '://' + app.host

    let tpl = `Hey fellow!
You've been invited to Monitoring PRO system.

Please login at ${endpoint} using these credentials:
Login: ${email}
Password: ${password}

Sincerely your, 
MPro Team`

    return this.sendPlain(email, 'Welcome to MPRO', tpl)
  }
}

module.exports = MailerEngine
