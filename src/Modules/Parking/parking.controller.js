
import ApiFeatures from '../../utils/api-feature.js';
import generateQrCode from '../../utils/qrcode.js';
import { role } from '../../utils/system-rules.js';
import Parking from './../../../DB/Models/parking.model.js';

export const addParking = async(req,res,next)=>{
  // destructuring the required data from request body
  const {parking_name,city,state,address,totalPlace,creditPointPerHour,creditPointPerMonth,locationMap} = req.body
  // destructuring user data from authenticated request
  const {id:ownerId} = req.user
  // check price -> (Day or Month)
  if(!creditPointPerHour && !creditPointPerMonth) return next(new Error('must send creditPointPrice',{cause:404}))
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
    creditPointPerHour,
    creditPointPerMonth,
    locationMap
  })
  // save parking in database
  await parking.save()
  req.saveDocument = {model:Parking,_id: parking._id}
  res.status(201).json({message:'parking added successfully',data:parking,success:true})
}

export const updateParking = async(req,res,next)=> {
  // destructuring the required data from request body
  const {parking_name,city,state,address,totalPlace ,creditPointPerHour, creditPointPerMonth,locationMap} = req.body
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
  if(creditPointPerHour) parking.creditPointPerHour = creditPointPerHour
  if(creditPointPerMonth) parking.creditPointPerMonth = creditPointPerMonth
  if(locationMap) parking.locationMap = locationMap
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
    const qrcode = await generateQrCode(parking)
  res.status(200).json({message:'fetched Parking details',data:parking,qrcode,success:true})
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

export const getParkLocation = async (req, res,next) =>{
    // destructuring location form request body
    const {locationMap} = req.body
    const {distance = 1000} = req.query
      Parking.createIndexes({"locationMap":"2d"})
      // const maxDistance = 10000; // Distance in meters
      const maxDistance = distance; // Distance in meters
      const park = await  Parking.find({
        locationMap: {
          $near: {
            $geometry: {
              type: locationMap.type,
              coordinates: locationMap.coordinates,
            },
            $maxDistance: maxDistance,
          },
        },
      })
    res.status(200).json({message:'fetched Near Park',data:park,success:true})
}

export const handleReserved = async (req, res, next) =>{
  // get Park
  const {parkingId} = req.params
  const {increase,decrease} = req.body
  const {id:ownerId,role:userRole} = req.user
  if(increase && decrease) return next(new Error('Values eqel ! , Send One Value',{cause:409}))
  const parking = await Parking.findById(parkingId)
  if(!parking) return next(new Error('Parking not found',{cause:404}))
  if(userRole != role.SUPERADMIN && ownerId != parking.ownerId) return next(new Error("Authorization Failed",{cause:403}))
  if(increase){
    if(parking.totalPlace < ( parking.reserved + 1)) return next(new Error("The reserved has been completed",{cause:400}))
    parking.reserved +=1
    parking.remainingSpace -= 1
    parking.save()
  }
  if(decrease){
    if(parking.reserved == 0 && parking.totalPlace != 0) return next(new Error("The garage is already empty",{cause:400})) 
    if(parking.totalPlace <= ( parking.reserved - 1)) return next(new Error("The reserved has been completed",{cause:400}))
    parking.reserved -=1
    parking.remainingSpace += 1
    parking.save()
  }
  return res.status(200).json({message:"Parking Reserved Successfully",data:parking,success:true})
}