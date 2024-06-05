import User from "../../../DB/Models/user.model.js"
import ApiFeatures from "../../utils/api-feature.js"


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

export const users = async (req,res,next) => {
  const {page,size,...search} = req.query
  const apiFeature = new ApiFeatures(req.query,User.find({},'-password')).pagination({page,size}).search(search)
  const users = await apiFeature.mongooseQuery
  res.status(200).json({message:'fetched users details',data:users,success:true})
}
export const deleteUser = async (req,res,next) => {
  const {accountId} = req.params
  // get the account
  const account = await User.findById(accountId)
  if(!account) return next(new Error('Account not found',{cause:404}))

  res.status(200).json({message:'fetched users details',data:true,success:true})
}