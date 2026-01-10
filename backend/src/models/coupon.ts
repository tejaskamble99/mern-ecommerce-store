import mongoose, { Schema } from "mongoose";



const schema = new mongoose.Schema({
    coupon :{
        type : String,
        required : [true , "Please Enter A Coupon Code"],
        unique : true
    },
    amount :{
        type : Number,
        required : [true , "Please Enter A Discount Amount"],
        unique : true
    }
    

})

export const Coupon = mongoose.model("Coupon", schema)
