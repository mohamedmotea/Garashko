import mongoose from "mongoose"



const event_schema = new mongoose.Schema({
    name: { type:String, required: true ,unique:true },
    description:{ type: String},
    link: { type: String },
    banner:{type:mongoose.Types.ObjectId, ref:"Banner",required:true},
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
    users:[{ type: mongoose.Types.ObjectId,ref:'User'}]
},{timestamps: true});

const Event = mongoose.model("Event",event_schema)

export default Event