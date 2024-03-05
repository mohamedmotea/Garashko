
import ApiFeatures from '../../utils/api-feature.js';
import { role } from '../../utils/system-rules.js';
import Parking from './../../../DB/Models/parking.model.js';

export const addParking = async(req,res,next)=>{
  // destructuring the required data from request body
  const {parking_name,city,state,address,totalPlace,pricePerDay,pricePerMonth} = req.body
  // destructuring user data from authenticated request
  const {id:ownerId} = req.user
  // check price -> (Day or Month)
  if(!pricePerDay && !pricePerMonth) return next(new Error('must send price',{cause:404}))
  // handle data received
  const location = {
    city,
    state,
    address
  }
  const check = await Parking.find({location,parking_name})
  if(check.length) return next(new Error('Parking already exists',{cause:409}))
  const parking = new Parking({
    ownerId,
    parking_name,
    ownerId,
    location,
    totalPlace,
    remainingSpace:totalPlace,
    pricePerDay,
    pricePerMonth
  })
  // save parking in database
  await parking.save()
  req.saveDocument = {model:Parking,_id: parking._id}
  res.status(201).json({message:'parking added successfully',data:parking,success:true})
}

export const updateParking = async(req,res,next)=> {
  // destructuring the required data from request body
  const {parking_name,city,state,address,totalPlace ,pricePerDay, pricePerMonth} = req.body
  // destructuring the required data from request params
  const {parkingId} = req.params
  // destructuring user data from authenticated request
  const {id:ownerId,role:userRole} = req.user
  // get Parking
  const parking = await Parking.findById(parkingId)
  if(!parking) return next(new Error('Parking not found',{cause:404}))
  // check authorization
  if(parking.ownerId != ownerId && userRole != role.SUPERADMIN) return next(new Error('unauthorized',{cause:403}))
  // handle data received
  const location = {
    city:city || parking.location.city,
    state:state || parking.location.state,
    address:address || parking.location.address
  }
  const check = await Parking.find({location,parking_name : parking_name || parking.parking_name,_id:{$ne:parkingId}})
  if(check.length) return next(new Error('Parking already exists',{cause:409}))
  parking.parking_name = parking_name || parking.parking_name
  parking.location = location
  if(totalPlace) parking.totalPlace = totalPlace 
  if(  pricePerDay) parking.pricePerDay = pricePerDay
  if(pricePerMonth) parking.pricePerMonth = pricePerMonth
  // save parking in database
  await parking.save()

  res.status(200).json({message:'parking updated successfully',data:parking,success:true})
}

export const AllParking = async(req,res,next)=>{
  const {page,size,...search} = req.query
  const apiFeature = new ApiFeatures(req.query,Parking.find().populate('ownerId','userName')).pagination({page,size}).search(search)
  const parking = await apiFeature.mongooseQuery
  res.status(200).json({message:'fetched Parking details',data:parking,success:true})
}

export const singlePark = async(req,res,next)=>{
  // destructuring id form request params
  const {parkingId} = req.params
  // get Parking
  const parking = await Parking.findById(parkingId).populate('ownerId','userName')
  if(!parking) return next(new Error('Parking not found',{cause:404}))
  res.status(200).json({message:'fetched Parking details',data:parking,success:true})
}

export const deleteParking = async(req,res,next)=> {
  // destructuring id form request params
  const {parkingId} = req.params
  // destructuring user data from authenticated request
  const {id:ownerId,role:userRole} = req.user
  // get Parking
  const parking = await Parking.findById(parkingId)
  if(!parking) return next(new Error('Parking not found',{cause:404}))
  // check authorization
  if(parking.ownerId!= ownerId && userRole != role.SUPERADMIN) return next(new Error('unauthorized',{cause:403}))
  // delete Parking
  await Parking.deleteOne({_id:parkingId})
  res.status(200).json({message:'parking deleted successfully',data:parking,success:true})
}