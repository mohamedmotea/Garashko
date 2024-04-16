import { DateTime } from 'luxon';
import Vehicle from './../../../DB/Models/vehicle.model.js';
import * as systemRule from '../../utils/system-rules.js';
import Reservation from '../../../DB/Models/reservation.model.js';
import Parking from '../../../DB/Models/parking.model.js';
import createInvoice from '../../utils/pdfkit.js';
import uniqueString from './../../utils/generate-unique-string.js';
import { confimedPaymentIntent, createCheckOutSession, createPaymentIntent } from '../../payment-handler/stripe.js';


export const reservation = async (req,res,next)=>{
  // destructuring required data from request body
  const {paymentMethod,fromDate,vehicle,quantity,isHour,isMonth} = req.body
  // destructuring user data from authenticated request
  const {id:userId,userName} = req.user
  // destructuring parking id from request params
  const {parkingId} = req.params
  // get parking by id
  const park = await Parking.findById(parkingId)
  if(!park) return next(new Error('Parking not found',{cause:404}))
  // check isHour and isMonth
if(isHour == isMonth || (!isHour && !isMonth)) return next(new Error('check type of (isHour or isMonth)',{cause:400}))
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
  let toDate;
  console.log(DateTime.fromISO(DateTime.fromJSDate(new Date(fromDate))))
  let convertFromDate =  fromDate ? DateTime.fromISO(DateTime.fromJSDate(new Date(fromDate))) : DateTime.now()
  if(isHour) {
    toDate = DateTime.fromISO(convertFromDate).plus({hours:+quantity}).toFormat('yyyy-MM-dd hh:mm')
    basePrice = park.pricePerHour
  }
  if(isMonth){
    toDate = DateTime.fromISO(convertFromDate).plus({months:+quantity}).toFormat('yyyy-MM-dd hh:mm')
    basePrice = park.pricePerMonth
  } 
  totalPrice = basePrice * quantity

  let reservationStatus = systemRule.reservationStatus.PENDING
  if(paymentMethod == systemRule.paymentMethod.CASH){
    reservationStatus = systemRule.reservationStatus.PLACED
  }
  const reservation = {
    paymentMethod,
    fromDate:convertFromDate.toFormat("yyyy-MM-dd hh:mm"),
    toDate,
    vehicleId,
    userId,
    parkingId,
    reservationStatus,
    isHour,
    isMonth,
    basePrice,
    totalPrice,
    quantity
  }
  const newReservation = new Reservation(reservation)
  // await newReservation.save()
  req.savedDocument = {model:Reservation,_id:newReservation._id}
  // pdf reset 
  // const orderCode = `${userId}_${uniqueString(4)}`
  // const invoiceObj = {
  //   date: DateTime.now().toFormat('yyyy-MM-dd hh:mm'),
  //   name:userName,
  //   shipping:park.location,
  //   items:[{
  //     name:park.parking_name,
  //     fromDate:reservation.fromDate,
  //     toDate:reservation.toDate,
  //     basePrice:reservation.basePrice,
  //     quantity:reservation.quantity,
  //     totalPrice:reservation.totalPrice
  //   }],
  //   subTotal:reservation.totalPrice,
  //   paidAmount:reservation.totalPrice,
  //   orderCode,
  // }
  // createInvoice(invoiceObj,`${orderCode}.pdf`)

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




// *********************** Payment ****************//

export const payWithStripe = async (req, res, next) => {
  // destructuring order id from request params
  const {reservationId} = req.params;
  // destructuring user data from authentiction
  const {id:userId , email:customer_email} = req.user
  // get reservation data 
  const reservation = await Reservation.findOne({_id:reservationId,userId,reservationStatus :systemRule.reservationStatus.PENDING}).populate(['parkingId','userId'])
  if(!reservation) return next(new Error('Reservation not found',{cause:404}))

  const paymentArguments = {
    customer_email,
    discounts:[],
    metadata:{orderId:reservationId.toString()},
    line_items:[{
        price_data:{
          currency: 'EGP',
          product_data:{
            name:reservation.parkingId.parking_name
          },
          unit_amount:reservation.basePrice * 100,
        },
        quantity:reservation.quantity
      }]
    
  }
  
  const payment = await createCheckOutSession(paymentArguments)
  const paymentIntent = await createPaymentIntent({amount:reservation.totalPrice})

  res.status(200).json({data:payment,paymentIntent})
}

// webhook local
export const webhookLocal = async (req, res ,next) => {
  const order = await Order.findById(req.body.data.object.metadata.orderId)
  if(!order) return next(new Error('order not found',{cause:404}))
  await confimedPaymentIntent({paymentIntentId:order.payment_method})
  order.orderStatus = systemRule.orderstatus.PAID,
  order.isPaid = true,
  order.paidAt = DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss'),
  // save document in database
  order.save()
  res.status(200).json({message: 'webhook received successfully'})
}
// webhook host
export const webhook = async (req, res ,next) => {
  const sig = req.headers['stripe-signature'].toString();
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_SECRET_KEY);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      const order = await Order.findById(JSON.parse(req.body).data.object.metadata.orderId)
      if(!order) return next(new Error('order not found',{cause:404}))
      await confimedPaymentIntent({paymentIntentId:order.payment_method})
      order.orderStatus = systemRule.orderstatus.PAID,
      order.isPaid = true,
      order.paidAt = DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss'),
      // save document in database
      order.save()
      res.status(200).json({message: 'webhook received successfully'})
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }



}