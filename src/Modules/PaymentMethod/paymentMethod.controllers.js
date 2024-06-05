import PaymentMethod from "../../../DB/Models/PaymentMethod.js"
import Banner from "../../../DB/Models/banner.model.js"
import ApiFeatures from "../../utils/api-feature.js"
import cloudinaryConnection from "../../utils/cloudinary.js"
import uniqueString from "../../utils/generate-unique-string.js"
import generateQrCode from "../../utils/qrcode.js"

export const singlePaymentMethod = async (req,res,next) => {
  // destructuring the required data from request params
  const {paymentMethodId} = req.params
  // get the payment data
  const paymentMethod = await PaymentMethod.findById(paymentMethodId)
  if(!paymentMethod) return next(new Error('PaymentMethod not found',{cause:404}))
    // QrCode 
    const qrcode = await generateQrCode(paymentMethod)
  // return the wallet data
  res.status(200).json({message:'fetched paymentMethod details',data:paymentMethod,qrcode,success:true})
}

export const paymentMethods = async (req,res,next) => {
  const {page,size,...search} = req.query
  const apiFeature = new ApiFeatures(req.query,PaymentMethod.find()).pagination({page,size}).search(search)
  const paymentMethod = await apiFeature.mongooseQuery
  res.status(200).json({message:'fetched paymentMethod details',data:paymentMethod,success:true})
}

export const addPaymentMethod= async (req,res,next) => {
  // destructuring the required data from request params
  const {name,key,apiKey} = req.body
  // get the payment data
  const checkPaymentMethod = await PaymentMethod.findOne({key})
  if(checkPaymentMethod) return next(new Error('PaymentMethod is exist',{cause:404}))
  
  const paymentMethod = await PaymentMethod.create({name,key,apiKey})
  if(!paymentMethod) return next(new Error('paymentMethod is not created',{cause:404}))
  // return the payment data
    // QrCode 
    const qrcode = await generateQrCode(paymentMethod)
  // return the payment data
  res.status(200).json({message:'fetched Banner details',data:paymentMethod,qrcode,success:true})
}

export const updatePaymentMethod = async (req,res,next) => {
  // destructuring the required data from request params
  const {paymentMethodId} = req.params
  const {name,key,apiKey} = req.body

  // get the payment data
  const paymentMethod = await PaymentMethod.findById(paymentMethodId)
  if(!paymentMethod) return next(new Error('paymentMethod not found',{cause:404}))
if(name) paymentMethod.name = name
  if(key){
    const checkName = await PaymentMethod.findOne({key})
    if(checkName) return next(new Error('paymentMethod is exist',{cause:404}))
      paymentMethod.key = key
  }
  if(apiKey) paymentMethod.apiKey = apiKey

  res.status(200).json({message:'updated paymentMethod details',data:paymentMethod,success:true})

}

export const deletePaymentMethod = async (req,res,next) => {
  // destructuring the required data from request params
  const {paymentMethodId} = req.params
  // get the payment data
  const paymentMethod = await PaymentMethod.findByIdAndDelete(paymentMethodId)
  if(!paymentMethod) return next(new Error('paymentMethod not found',{cause:404}))
  // return the payment data
  res.status(200).json({message:'deleted paymentMethod details',data:paymentMethod,success:true})
}