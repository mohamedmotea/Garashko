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

export const users = async (req,res,next) => {
  const { size = 10, page = 1 ,userName,phone} = req.query
  const skip = (page - 1) * size;
  let query = {}
  if(phone) query.phone = {$regex:phone}
  if(userName) query.userName = {$regex:userName,$options:'i'}
  const users = await User.aggregate([
    {$lookup: {
      from: "wallets",
      localField: "_id",
      foreignField: "user",
      as: "wallet"
    }},
    {$unwind:{
      path: "$wallet",
      preserveNullAndEmptyArrays: true
    }},
    {
      $project: {
          password: 0 
      }
  },
    {$match:query},
    {$sort:{createdAt:-1}},
    {$skip:skip},
    {$limit:size}

  ])

  res.status(200).json({message:'fetched users details',data:users,success:true})
}
export const deleteUser = async (req,res,next) => {
  const {accountId} = req.params
  // get the account
  const account = await User.findByIdAndDelete(accountId)
  if(!account) return next(new Error('Account not found',{cause:404}))

  res.status(200).json({message:'fetched users details',data:true,success:true})
}