import { Schema, model } from "mongoose";
import { role } from "../../src/utils/system-rules.js";

const user_schema = new Schema({
  userName:{
    type:String,
    required:true,
    minLength:3,
    maxLength:99,
    trim:true,
  },
  email:{
    type:String,
    required:true,
    trim:true,
    unique:true,
  },
  password:{
    type:String,
    required:true,
    minLength:6
  },
  phoneNumber:{
    type:String,
    required:true,
    unique:true,
  },
  role:{
    type:String,
    required:true,
    enum:Object.values(role),
    default:role.USER,
  },
  isEmailVerified:{
    type:Boolean,
    default:false
  },
  isActive:{
    type:Boolean,
    default:false
  },
  provider:{
    type:String,
    enum:["Google"]
  }
},{timestamps:true,toJSON:{
  transform: function(doc, ret) {
    delete ret.password; // إزالة الحقل من النتيجة النهائية
    return ret;
  }
},
toObject: {
  transform: function(doc, ret) {
    delete ret.password; // إزالة الحقل من النتيجة النهائية
    return ret;
  }
}});
const User = model("User",user_schema)

export default User