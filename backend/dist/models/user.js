import mongoose from "mongoose";
import validator from "validator";
const roles = ["admin", "user"];
const genders = ["male", "female"];
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please enter Id"],
    },
    photo: {
        type: String,
        required: [true, "Please upload Img"],
        validate: {
            validator: (url) => validator.isURL(url),
            message: "Please enter a valid URL for photo",
        },
    },
    name: {
        type: String,
        required: [true, "Please enter Name"],
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [50, "Name must not exceed 50 characters"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please enter Email"],
        validate: {
            validator: (email) => validator.isEmail(email),
            message: "Please enter a valid Email",
        },
    },
    role: {
        type: String,
        enum: roles,
        default: "user",
    },
    gender: {
        type: String,
        enum: genders,
        required: [true, "Enter gender"],
    },
    dob: {
        type: Date,
        required: [true, "Enter DOB"],
        validate: {
            validator: (value) => value < new Date(),
            message: "Date of birth must be in the past",
        },
    },
}, {
    timestamps: true,
    strict: true,
});
// Virtual for age computation
userSchema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});
export const User = mongoose.model("User", userSchema);
//# sourceMappingURL=user.js.map