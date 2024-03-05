import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import verifyEmailService from './utils/verifyEmail.js';
import User from './../../../DB/Models/user.model.js';

export const signUp = async (req,res,next)=>{
  // destructure the required data for request body
  const {userName,email,password,role,phoneNumber} = req.body
  // check if email is already exists in database
  const checkEmail = await User.findOne({email})
  if(checkEmail) return res.status(409).json({message: "Email already exists"})
  // verify Email -> send code in email
  const verify = await verifyEmailService(email,req)
  // check is email valid
  if(!verify) return next(new Error('email verify fail',{cause:400})) 
  // Hashed password 
  const hashedPassword = bcrypt.hashSync(password,+process.env.SALT_ROUNDES)
  if(!hashedPassword) return next(new Error('password fail try again',{cause:400}))
  // create a new User 
  const newUser = await User.create({userName,email,password:hashedPassword,role,phoneNumber})
  if(!newUser) return next(new Error('created failed',{cause:400}))
  req.savedDocument = {model:User,_id:newUser._id}
  res.status(201).json({message:'account created successfully',success:true})
}

export const verifyEmail = async (req,res,next)=>{
  // destructure email from request query
  const {email} = req.query
  // decode email by jwt 
  const decodeEmail = jwt.verify(email,process.env.VERIFICATION)
  // find this account 
  const account = await User.findOne({email: decodeEmail.email})
  if(!account) return next(new Error('account not found',{cause:404}))
  // check if this account already verified
  if (account.isEmailVerified) res.status(200).json({message:'this account already verifiy'})
  // verified account in database
  account.isEmailVerified = true
  await account.save()
  res.status(200).json({message:'email verified successfully',success:true})
}

export const signIn = async (req,res,next)=>{
  // destructure the required data for request body
  const {email,password} = req.body
  // find this account
  const account = await User.findOne({email})
  if(!account) return next(new Error('account not found',{cause:404}))
  // check if this account already verified
  if (!account.isEmailVerified) {
      // verify Email -> send code in email
      const verify = await verifyEmailService(email,req)
      if(!verify) return next(new Error('email verify fail',{cause:400}))   
      return next(new Error('account not verified , check your email',{cause:400}))
  }
  // check if password is correct
  const isPasswordCorrect = bcrypt.compareSync(password,account.password)
  if(!isPasswordCorrect) return next(new Error('password incorrect',{cause:400}))
  // update login status
  account.isActive = true
  await account.save()
  // create token
  const token = jwt.sign(
    {id:account._id,email:account.email,userName:account.userName,
      createdAt:account.createdAt,role:account.role},
      process.env.TOKEN_SIGNATURE,
      {expiresIn: '9d'})
  res.status(200).json({message: 'login successful', token,success:true})
}

export const updateAccount = async (req,res,next) =>{
    // destructure the required data for request body
    const {userName,phoneNumber,oldPassword,newPassword,email} = req.body 
    const {id} = req.user
    // User Account
    const account = await User.findById(id)
    if(!account) return next(new Error('account not found',{cause:404}))
    if(email && email != account.email) {
      // check if email is already exists in database
      const checkEmail = await User.findOne({email,_id:{$ne:id}})
      if(checkEmail) return next(new Error('Email is already exists',{cause:409}))
      // verify Email -> send code in email
      const verify = await verifyEmailService(email,req)
      // check is email valid
      if(!verify) return next(new Error('email verify fail',{cause:400})) 
        // reset email verification
        account.isEmailVerified = false
    }
    if(oldPassword){
      if(!newPassword) return next(new Error('newPassword required with oldPassword',{cause:404}))
      // check if old password is correct
        const checkOldPassword = bcrypt.compareSync(oldPassword,account.password)
        if(!checkOldPassword) return next(new Error('password incorrect',{cause:400}))
        // hashed new password
        const hashedPassword = bcrypt.hashSync(newPassword,+process.env.SALT_ROUNDES)
        if(!hashedPassword) return next(new Error('password fail try again',{cause:400}))
        // update password only
        account.password = hashedPassword
    }
      // update userName
      if(userName) account.userName = userName
      if(phoneNumber) {
        const checkNumber = await User.findOne({phoneNumber,_id:{$ne:id}})
        if(checkNumber) return next(new Error('phone number is already exists',{cause:409}))
        account.phoneNumber = phoneNumber}
      // save in database
      await account.save()
      return res.status(200).json({message:'account updated successfully',success:true})  
}

export const deleteAccount = async (req,res,next)=>{
  // destructure the required data for request authintcation
  const {id} = req.user
  // delete account
  const deleteAccount = await User.findByIdAndDelete(id)
  if(!deleteAccount) return next(new Error('delete fail',{cause:400}))
  return res.status(200).json({message:'Accound deleted successfully',success:true})
}
