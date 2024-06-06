import mongoose from "mongoose"



const banner_schema = new mongoose.Schema({
    name: { type:String, required: true ,unique:true },
    description:{ type: String},
    link: { type: String }, 
    image:{ 
      secure_url:{type:String, required:true},
      public_id:{type:String, required:true,unique:true}
      },
      folderId:{type:String, required:true,unique:true},
    active: { type: Boolean, default: true },
},{timestamps: true});

const Banner = mongoose.model("Banner",banner_schema)

export default Banner