import { User } from "../models/user.js";
import { TryCatch } from "../middleware/error.js";
import ErrorHandler from "../utils/utility-class.js";
export const newUser = TryCatch(async (req, res, next) => {
    const { name, email, photo, gender, userId, dob } = req.body;
    if (!name || !email || !photo || !gender || !userId || !dob) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }
    let user = await User.findById(userId); // Use findById since _id = userId
    if (user) {
        return res.status(200).json({
            success: true,
            message: `Welcome, ${user.name}`,
        });
    }
    user = await User.create({
        _id: userId, // Only set _id, remove duplicate userId field
        name,
        email,
        photo,
        gender,
        dob: new Date(dob),
    });
    return res.status(201).json({
        success: true,
        message: `User ${user.name} created successfully`,
        user,
    });
});
export const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find({});
    return res.status(200).json({
        success: true,
        users,
    });
});
export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id); // Use findById directly
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    return res.status(200).json({
        success: true,
        user,
    });
});
//# sourceMappingURL=user.js.map