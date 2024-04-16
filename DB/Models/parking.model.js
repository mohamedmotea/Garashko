import { Schema, model } from "mongoose";

const parking_schema = new Schema({
  ownerId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  parking_name:{
    type:String,
    required:true,
    minLength:1,
    maxLength:99,
    trim:true
  },
  location:{
    city:{type:String,required:true},
    state:{type:String,required:true},
    address:{type:String,required:true}
  },
  totalPlace:{
    type:Number,
    required:true,
    min:1,
    default:1
  },
  reserved:{
    type:Number,
    min:0,
    default:0
  },
  remainingSpace:{
    type:Number,
    min:1,
    default:1,
  },
  rate:{
    type:Number,
    required:true,
    min:0,
    max:5,
    default:0,
  },
  creditPointPerHour:{
    type:Number,
    min:0,
    default:0,
    required:true
  }, 
  creditPointPerMonth:{
    type:Number,
    min:0,
    default:0,
    required:true
  },
  locationMap: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
  
},{timestamps:true});

const Parking = model("Parking",parking_schema);

export default Parking;