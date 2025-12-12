import { User } from "../models/user.js";
import { TryCatch } from "../middleware/error.js";
export const newUser = TryCatch(async (req, res, next) => {
    const { name, email, photo, gender, userId, dob } = req.body;
    const user = await User.create({
        name,
        email,
        photo,
        gender,
        userId,
        dob: new Date(dob),
    });
    console.log(user);
    return res.status(200).json({
        success: true,
        message: `User ${user.name} created successfully`,
        user,
    });
});
//# sourceMappingURL=user.js.map