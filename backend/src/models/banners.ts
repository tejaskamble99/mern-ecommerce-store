import mongoose, { Schema } from "mongoose";


const schema = new mongoose.Schema({
    image: {type: String, required: true},
    slot : {
        type : String,
        enum:["hero", "promo", "bottom"],
        required: true
    },
    createdAt : {type: Date, default: Date.now}
});

export const Banner = mongoose.model("Banner", schema)