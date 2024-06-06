import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    apiKey: { type: String },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
}, { timestamps: true});


const PaymentMethod= mongoose.model("PaymentMethod", schema);

export default PaymentMethod;