
import  jwt from 'jsonwebtoken';
import sendEmailService from './../../Services/send-emails.services.js';


const verifyEmailService = async(email,req)=>{
  // email Token 
  const token = jwt.sign({email},process.env.VERIFICATION,{expiresIn: '2m'})
  // send email verification
  const verification = await sendEmailService({to:email,subject:'التحقق من الحساب',message:`
  <h1>hello .. </h1>
  <hr>
  <h4>Link Verification Email</h4>
  <button style="backgroundColor:#070857">
  <a href=${req.protocol}://${req.headers.host}/api/v1/auth/verify?email=${token}>Click Here</a> </button>
  <p>If you did not request a verify email, please ignore this email</p>
  `})
  // check is email valid
  if(!verification) return null;
  return true
}

export default verifyEmailService