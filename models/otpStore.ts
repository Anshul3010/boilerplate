import mongoose from "mongoose";

let schema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    otp: {
        type: String
    },
    timestamp: {
        type: String
    }
});

let OTPModel = mongoose.model('otp', schema);
export {OTPModel};