import { Schema, model } from "mongoose";
import { serviceArr } from "../../src/utils/system-rules.js";

const service_schema = new Schema({
  service_type:{
    type:String,
    enum:[...serviceArr],
    required:true,
    minLength:3,
    maxLength:40,
    trim:true,
    unique:true
  },
    creditPoint:{
      type:Number,
      required:true,
      min:0,
      default:0
    },
    discount:{
      type:Number,
      min:0,
      default:0
    }
  
},{timestamps:true});

const Service = model("Service",service_schema);

export default Service;