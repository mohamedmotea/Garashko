import mongoose from "mongoose"



const wallet_schema = mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true ,unique:true },
    active: { type: Boolean, default: true },
    total:{ type: Number, default: 0, min: 0 }
},{timestamps: true});

const Wallet = mongoose.model("Wallet",wallet_schema)

export default Wallet