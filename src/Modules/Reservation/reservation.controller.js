import { DateTime } from 'luxon';
import Vehicle from './../../../DB/Models/vehicle.model.js';
import * as systemRule from '../../utils/system-rules.js'
import Reservation from '../../../DB/Models/reservation.model.js';
import Parking from '../../../DB/Models/parking.model.js';
import createInvoice from '../../utils/pdfkit.js';
import uniqueString from './../../utils/generate-unique-string.js';

export const reservation = async (req,res,next)=>{
  // destructuring required data from request body
  const {paymentMethod,fromDate = DateTime.now().toFormat('yyyy-MM-dd'),vehicle,quantity,isDay,isMonth} = req.body
  // destructuring user data from authenticated request
  const {id:userId,userName} = req.user
  // destructuring parking id from request params
  const {parkingId} = req.params
  // get parking by id
  const park = await Parking.findById(parkingId)
  if(!park) return next(new Error('Parking not found',{cause:404}))
  // check isDay and isMonth
  if(isDay == isMonth || (!isDay && !isMonth)) return next(new Error('check type of (isDay or isMonth)',{cause:400}))
  // handle data received
  let vehicleId = vehicle
  if(!vehicle) {
    const userVehicle = await Vehicle.findOne({ownerId:userId})
    if(!userVehicle) return next('Vehicle not found',{cause:404})
    vehicleId = userVehicle._id
  }
  // calc total Price
  let basePrice = 0
  let totalPrice = 0
  let toDate 
  if(isDay) {
    toDate = DateTime.fromISO(fromDate).plus({days:+quantity}).toFormat('yyyy-MM-dd')
    console.log(quantity)
    console.log(toDate)
    basePrice = park.pricePerDay
  }
  if(isMonth){
    toDate = DateTime.fromISO(fromDate).plus({months:+quantity}).toFormat('yyyy-MM-dd')
    basePrice = park.pricePerMonth
  } 
  totalPrice = basePrice * quantity

  let reservationStatus = systemRule.reservationStatus.PENDING
  if(paymentMethod == systemRule.paymentMethod.CASH){
    reservationStatus = systemRule.reservationStatus.PLACED
  }
  const reservation = {
    paymentMethod,
    fromDate,
    toDate,
    vehicleId,
    userId,
    parkingId,
    reservationStatus,
    isDay,
    isMonth,
    basePrice,
    totalPrice,
    quantity
  }
  const newReservation = new Reservation(reservation)
  await newReservation.save()
  req.savedDocument = {model:Reservation,_id:newReservation._id}
  // pdf reset 
  const orderCode = `${userId}_${uniqueString(4)}`
  const invoiceObj = {
    date: DateTime.now().toFormat('yyyy-MM-dd hh:mm'),
    name:userName,
    shipping:park.location,
    items:[{
      name:park.parking_name,
      fromDate:reservation.fromDate,
      toDate:reservation.toDate,
      basePrice:reservation.basePrice,
      quantity:reservation.quantity,
      totalPrice:reservation.totalPrice
    }],
    subTotal:reservation.totalPrice,
    paidAmount:reservation.totalPrice,
    orderCode,
  }
  createInvoice(invoiceObj,`${orderCode}.pdf`)

  res.status(201).json({message:'reservation created successfully',data:newReservation,success:true})

}

// export const updateReservation = async(req, res,next) =>{
//   // destructuring the required data from request body
//   const {paymentMethod,fromDate,vehicle,quantity,isDay,isMonth} = req.body;
//   // destructuring user data from authenticated request
//   const {id:userId} = req.user
//   // destructuring parking id from request params
//   const {parkingId} = req.params
//   // get parking by id
//   const park = await Parking.findById(parkingId)
//   if(!park) return next(new Error('Parking not found',{cause:404}))
//   // check isDay and isMonth
//   if(isDay == isMonth || (!isDay &&!isMonth)) return next(new Error('check type of (isDay or isMonth)',{cause:400}))
//   // handle data received
//   let vehicleId = vehicle
//   if(!vehicle) {
//     const userVehicle = await Vehicle.findOne({ownerId:userId})
//     if(!userVehicle) return next('Vehicle not found',{cause:404})
//     vehicleId = userVehicle._id
//   }
//   // calc total Price
//   let basePrice = 0
//   let totalPrice = 0
//   let toDate
// }