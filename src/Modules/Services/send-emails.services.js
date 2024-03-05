import nodemailer from 'nodemailer'

const sendEmailService = async({to = '',subject = 'no-replay',message = '<h1>no content</h1>'})=>{
  const transporter = nodemailer.createTransport({
    host: 'smtp.forwardemail.net',
    service: 'gmail',
    port: 465, // 587
    secure: true,  
    auth: {
      user:  process.env.EMAIL_SERVICE,
      pass:  process.env.PASSWORD_SERVICE
    }
  })
  const info = await transporter.sendMail({
    from: `"Garashko ⚒️" <${process.env.EMAIL_SERVICE}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    html:message, // html body
  })
  return info.accepted.length ? true : false
}
export default sendEmailService;