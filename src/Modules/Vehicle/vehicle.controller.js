import Vehicle from "../../../DB/Models/vehicle.model.js"
import cloudinaryConnection from './../../utils/cloudinary.js';
import { role } from './../../utils/system-rules.js';


export const addVehicle = async (req,res,next)=>{
  // destructuring required data from request body
  const {licenseLetters,licenseNumbers,type,model,color,endOfLicense,BeginningOfLicense} = req.body
  // destructuring user data from authenticated request
  const {id:ownerId} = req.user
  // handle data received
  const vehicle_license = {
    licenseNumbers,
    licenseLetters
  }
  const vehicle_info = {
    type,
    model
  }
  // check vehicle_license exist
  const checkVehicle_license = await Vehicle.findOne({'vehicle_license.licenseNumbers':licenseNumbers,'vehicle_license.licenseLetters':licenseLetters})
  if(checkVehicle_license) return next(new Error('license already exists',{cause:409}))
  let faceId = {}
  // parse image data from request file
  if(req.file?.path){
    const {secure_url,public_id} = await cloudinaryConnection().uploader.upload(req.file.path,{
      folder: `${process.env.MAIN_FOLDER}/vehicle/${ownerId}/`
    })
    faceId.secure_url = secure_url
    faceId.public_id = public_id
  }
  // create new vehicle info
  const vehicle = new Vehicle({
    ownerId,
    vehicle_license,
    vehicle_info,
    color,
    endOfLicense,
    BeginningOfLicense,
    faceId
  })
  // sace information for vehicle in database
  await vehicle.save()
  req.saveDocument = {model:Vehicle,_id: vehicle._id}
  req.folder = `${process.env.MAIN_FOLDER}/vehicle/${ownerId}/`
  res.status(201).json({message:'vehicle added successfully',data:vehicle,success:true})
}

export const updateVehicle = async(req,res,next) => {
  // destructuring required data from request body
  const {licenseLetters,licenseNumbers,type,model,color,endOfLicense,BeginningOfLicense} = req.body
  // destructuring required data from request params
  const {vehicleId} = req.params
  // destructuring user data from authenticated request
  const {id:ownerId} = req.user
  // get vehicle information
  const vehicle = await Vehicle.findOne({_id: vehicleId,ownerId})
  if(!vehicle) return next(new Error('Vehicle not found',{cause:404}))
  // handle data received
  let licenseObj = {}
  // check vehicle_license exist
  if(licenseLetters || licenseNumbers){
    licenseObj.licenseNumbers = licenseNumbers || vehicle.vehicle_license.licenseNumbers
    licenseObj.licenseLetters = licenseLetters || vehicle.vehicle_license.licenseLetters
    const checkVehicle = await Vehicle.findOne({_id:{$ne:vehicleId},'vehicle_license.licenseNumbers':{$eq:licenseObj.licenseNumbers},'vehicle_license.licenseLetters':{$eq:licenseObj.licenseLetters}})
    if(checkVehicle) return next(new Error('license already exists',{cause:409}))
    vehicle.vehicle_license = licenseObj
  }
  if(type) vehicle.vehicle_info.type = type
  if(type) vehicle.vehicle_info.model = model
  if(color) vehicle.color = color
  if(endOfLicense) vehicle.endOfLicense = endOfLicense
  if(BeginningOfLicense) vehicle.BeginningOfLicense = BeginningOfLicense
  await vehicle.save()

  res.status(200).json({message:'vehicle updated successfully',data:vehicle,success:true})

}

export const allVehicles = async (req,res,next)=>{
  const vehicles = await Vehicle.find()
  if(!vehicles) return next(new Error('Vehicle not found',{cause:404}))
  res.status(200).json({message:'fetched All vehicles details',data:vehicles,success:true})
}

export const myVehicle = async (req,res,next)=>{
  // destructuring user data from authenticated request
  const {id:ownerId} = req.user
  // get vehicle information
  const vehicle = await Vehicle.find({ownerId})
  if(!vehicle) return next(new Error('Vehicle not found',{cause:404}))
  res.status(200).json({message:'fetched vehicle details',data:vehicle,success:true})
}

export const deleteVehicle = async (req,res,next)=> {
  // destructuring required data from request params
  const {vehicleId} = req.params
  // destructuring user data from authenticated request
  const {id:ownerId,role:userRole} = req.user
  // get vehicle information
  const vehicle = await Vehicle.findById({_id: vehicleId})
  if(!vehicle) return next(new Error('Vehicle not found',{cause:404}))
  if(userRole != role.SUPERADMIN && vehicle.ownerId != ownerId) return next(new Error('unauthorized',{cause:403}))
  await Vehicle.deleteOne({_id:vehicleId})
  res.status(200).json({message:'vehicle deleted successfully',data:vehicle,success:true})
}