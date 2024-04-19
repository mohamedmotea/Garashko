
import Order from '../../../DB/Models/order.model.js';
import Service from '../../../DB/Models/service.model.js';
import ApiFeatures from '../../utils/api-feature.js';
import { reservationStatus, role } from '../../utils/system-rules.js';

export const addOrder = async(req,res,next)=>{
  const {id:userId} = req.user
  const {services,location} = req.body 
  let subtotal = 0
  for (const service of services) {
    const serviceItem = await Service.findById(service)
    subtotal += +serviceItem.creditPoint * ((serviceItem.discount / 100 )|| 1)}
  const order = await Order.create({
    services,
    userId,
    subtotal,
    location
  })
  return res.status(201).json({message:"Create Order Successfully",data:order,success:true})
}
export const updateOrder= async(req,res,next)=>{
  const {orderId} = req.params
  const {id:userId} = req.user
  const {newServices,removeService} = req.body 
  const order = await Order.findOne({orderId,userId}).sort({createdAt:-1})
  if(!order) return next(new Error('Order notfount',{cause:404}))
  if(removeService) await Order.findByIdAndUpdate(orderId,{services:{$poll:removeService}})
  if(newServices) order.services.push(...newServices)
  let subtotal = 0
  order.services = new Set(order.services)
  for (const service of order.services) {
    const serviceItem = await Service.findById(service)
    subtotal += +serviceItem.creditPoint * ((serviceItem.discount / 100 )|| 1)}
    order.subtotal = subtotal

    await order.save()
  return res.status(201).json({message:"Updated Order Successfully",data:order,success:true})
}

export const allOrders = async(req,res,next)=>{
  const {page,size,...search} = req.query
  const apiFeature = new ApiFeatures(req.query,Order.find().populate("services")).pagination({page,size}).search(search)
  const orders = await apiFeature.mongooseQuery

  res.status(200).json({message:'fetched All orders details',data:orders,success:true})
}
export const userOrders = async(req,res,next)=>{
  const {id:userId} = req.user
  const orders = await Order.find({userId}).sort({createdAt:-1}).populate("services")
  res.status(200).json({message:'fetched user orders details',data:orders,success:true})
}
export const singleOrder = async(req,res,next)=>{
  const {orderId} = req.params
  const order = await Order.findById(orderId).populate("services")
  if(!order) return next(new Error('order notfount',{cause:404}))
  res.status(200).json({message:'fetched order details',data:order,success:true})
}

export const deleteOrder = async(req,res,next)=>{
  const {orderId} = req.params
  const order = await Order.findByIdAndDelete(orderId)
  if(!order) return next(new Error('order notfount',{cause:404}))
  res.status(200).json({message:'order Deleted Successfuly',data:order,success:true})
}

export const administrationOrder = async(req,res,next)=>{
  const {orderId} = req.params
  const {status} = req.body
  const order = await Order.findByIdAndUpdate(orderId,{status},{new:true})
  if(!order) return next(new Error('order notfount',{cause:404}))
  res.status(200).json({message:'Order Status Changed Successfully',data:order,success:true})
}