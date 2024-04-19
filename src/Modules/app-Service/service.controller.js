
import Service from '../../../DB/Models/service.model.js';
import ApiFeatures from '../../utils/api-feature.js';
import { role } from '../../utils/system-rules.js';

export const addService= async(req,res,next)=>{
  const {service_type,creditPoint,discount} = req.body 
  const serviceExist = await Service.findOne({service_type})
  if(serviceExist) return next(new Error('Service already exist',{cause:409}))
  const service = await Service.create({
    service_type,
    creditPoint,
    discount
  })
  return res.status(201).json({message:"Create Service Successfully",data:service,success:true})
}
export const updateService= async(req,res,next)=>{
  const {serviceId} = req.params
  const {service_type,creditPoint,discount} = req.body 

  const service = await Service.findById(serviceId)
  if(!service) return next(new Error('Service notfount',{cause:404}))
  if(service_type){
    if(await Service.findOne({service_type,_id:{$ne:serviceId}}) ) return next(new Error('Service already exist',{cause:409}))
    service.service_type = service_type
}
if(creditPoint) service.creditPoint = creditPoint
  if(discount) service.discount = discount
  await service.save()
  return res.status(200).json({message:"Service updated Successfully",data:service,success:true})
}

export const allService = async(req,res,next)=>{
  const {page,size,...search} = req.query

  const apiFeature = new ApiFeatures(req.query,Service.find()).pagination({page,size}).search(search)
  const services = await apiFeature.mongooseQuery
  res.status(200).json({message:'fetched All services details',data:services,success:true})
}
export const singleService = async(req,res,next)=>{
  const {serviceId} = req.params
  const service = await Service.findById(serviceId)
  if(!service) return next(new Error('Service notfount',{cause:404}))
  res.status(200).json({message:'fetched service details',data:service,success:true})
}
export const deleteService = async(req,res,next)=>{
  const {serviceId} = req.params
  const service = await Service.findByIdAndDelete(serviceId)
  if(!service) return next(new Error('Service notfount',{cause:404}))
  res.status(200).json({message:'Service Deleted Successfuly',data:service,success:true})
}
  