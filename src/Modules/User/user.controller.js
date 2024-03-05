import User from "../../../DB/Models/user.model.js"


export const getAccountData = async (req,res,next) => {
  // destructuring the required data from authentication
  const {id} = req.user
  // get the account
  const account = await User.findById(id).select('-password -isEmailVerified')
  if(!account) return next(new Error('Account not found',{cause:404}))
  // return the account data
  res.status(200).json({message:'fetched account details',data:account,success:true})
}

export const getSpecialAccount = async (req,res,next) => {
  // destructuring the required data from request params
  const {accountId} = req.params
  // get the account
  const account = await User.findById(accountId).select('userName')
  if(!account) return next(new Error('Account not found',{cause:404}))
  // return the account data
  res.status(200).json({message:'fetched account details',data:account,success:true})
}