
import { Schema, model } from 'mongoose';
import { paymentMethod, reservationStatus } from '../../src/utils/system-rules.js';

const reservation_schema = new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  vehicleId:{
    type:Schema.Types.ObjectId,
    ref:'Vehicle',
    required:true
  },
  parkingId:{
    type:Schema.Types.ObjectId,
    ref:'Parking',
    required:true
  },
  canceledBy:{
   type:Schema.Types.ObjectId,
   ref:'User',
  },
  paymentMethod:{
    type:String,
    enum: Object.values(paymentMethod),
    required:true
  },
   reservationStatus :{
    type:String,
    enum: Object.values(reservationStatus),
    default:reservationStatus.PENDING
   },
   canceledAt:{
    type:Date
   },
   fromDate:{
    type:String,
    required:true
   },
   toDate:{
    type:String,
    required:true
   },
   totalPrice:{
    type:Number,
    required:true,
    min:0,
    default:0
   },
   basePrice:{
    type:Number,
    required:true,
    min:0,
    default:0
   },
   quantity:{
    type:Number,
    required:true,
    min:1,
    default:1
   },
   isHour:{
    type:Boolean,
    default:false
   },
   isMonth:{
    type:Boolean,
    default:false
   }
   

},{timestamps:true})

const Reservation = model("Reservation",reservation_schema)

export default Reservation
