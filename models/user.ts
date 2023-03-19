import mongoose from "mongoose";

let schema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    user_name: {
        type: String
    },
    verified: {
        type: Boolean
    }
});

let UserModel = mongoose.model('user', schema);
export {UserModel};