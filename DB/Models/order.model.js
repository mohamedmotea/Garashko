import { Schema, model } from "mongoose";
import { reservationStatus } from "../../src/utils/system-rules.js";

const order_schema = new Schema({
    services:[{
      type:Schema.Types.ObjectId,
      required:true,
      ref:"Service"
    }],
    subtotal:{
      type:Number,
      required:true,
      min:0,
      default:0
    },
    userId:{
      type:Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    location:{
        type: {
          type: String, 
          enum: ['Point'], 
          required: true}
          ,coordinates: 
          {  type: [Number],  required: true}
    },
    status:{
      type:String,
      enum: Object.values(reservationStatus),
      default:reservationStatus.PENDING
    }
  
},{timestamps:true});

const Order = model("Order",order_schema);

export default Order;