import { DateTime } from 'luxon';
import { Schema, model } from 'mongoose';

const vehicle_schema = new Schema({
  ownerId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  vehicle_license:{
    licenseLetters:{type:Array,required:true,min:1,max:4},
    licenseNumbers:{type:Array,required:true,min:1,max:5},
  },
  vehicle_info:{
    type:{type:String,required:true},
    model:{type:String,required:true}
  },
  color:{
    type:Array
  },
  endOfLicense:{
    type:Date,
    required:true,
    min: DateTime.now()
  },
  BeginningOfLicense:{
    type:Date,
    required:true,
    max:DateTime.now()
  },
  faceId:{
    secure_url:{type:String},
    public_id:{type:String,unique:true}
  }


},{timestamps:true})

const Vehicle = model("Vehicle",vehicle_schema)

export default Vehicle