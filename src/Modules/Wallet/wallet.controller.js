import Wallet from "../../../DB/Models/wallet.model.js"
import ApiFeatures from "../../utils/api-feature.js"


export const addAmount = async (req,res,next) => {
  // destructuring the required data from request params
  const {userId} = req.params
  const {amount} = req.body
  // get the wallet data
  const wallet = await Wallet.findOne({user:userId})
  if(!wallet) return next(new Error('wallet not found',{cause:404}))
  wallet.total += amount
  await wallet.save()
  // return the wallet data
  res.status(200).json({message:'Wallet details',data:wallet,success:true})
}


export const userWallet = async (req,res,next) => {
  // destructuring the required data from authentication
  const {id} = req.user
  // get the wallet
  const wallet = await Wallet.findOne({user:id}).populate([{path:'user',select:'-password -isEmailVerified'}])
  if(!wallet) return next(new Error('wallet not found',{cause:404}))
  // return the wallet data
  res.status(200).json({message:'fetched wallet details',data:wallet,success:true})
}

export const singleWallet = async (req,res,next) => {
  // destructuring the required data from request params
  const {walletId} = req.params
  // get the wallet data
  const wallet = await Wallet.findById(walletId).populate(['user'])
  if(!wallet) return next(new Error('wallet not found',{cause:404}))
  // return the wallet data
  res.status(200).json({message:'fetched wallet details',data:wallet,success:true})
}
export const wallets = async (req,res,next) => {
  const {page,size,...search} = req.query
  const apiFeature = new ApiFeatures(req.query,Wallet.find().populate('user')).pagination({page,size}).search(search)
  const wallet = await apiFeature.mongooseQuery
  res.status(200).json({message:'fetched Wallets details',data:wallet,success:true})
}
