
import Rate from './../../../DB/Models/rate.model.js';
import Parking from './../../../DB/Models/parking.model.js';
import { calcRate } from './utils/calc-rate.js';

export const addRate = async (req,res,next)=>{
  // destructuring required data from request body
  const {rate} = req.body;
  // destructuring required data from request params
  const {parkingId} = req.params
  // get parking by id
  const park = await Parking.findById(parkingId)
  if(!park) return next(new Error('parking not found',{casuse:404}));
  // destructuring user data from authenticated request
  const {id:userId} = req.user
  const checkRate = await Rate.findOne({userId,parkingId}).populate([{path:'parkingId',select:"parking_name location rate"},{path:'userId',select:"userName"}])
  if(checkRate){
    checkRate.rating = rate
    await checkRate.save()
    const calcRateParking = await calcRate({parkingId})
    // save new rate in database
  return res.status(200).json({message:"rating updated successfully",rate:checkRate,parkRate:calcRateParking.rate,success:true})
  }
  const newRate = new Rate({
    userId,
    parkingId,
    rating:rate
  })
  // save new rate in database
  await newRate.save()
  const calcRateParking = await calcRate({parkingId})
  res.status(201).json({message:"rating send successfully",rate:newRate,success:true,parkRate:calcRateParking.rate})


}