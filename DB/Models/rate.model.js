import { Schema, model } from "mongoose";


const rate_schema = new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  parkingId:{
    type:Schema.Types.ObjectId,
    ref:"Parking",
    required:true
  },
  rating:{
    type:Number,
    required:true,
    min:0,
    max:5,
    default:0
  }

},{timestamps:true})

const Rate = model("Rate",rate_schema);

export default Rate;