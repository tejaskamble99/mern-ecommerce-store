import { User } from "../models/user.js";
export const newUser = async (req, res, next) => {
    try {
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `error`,
        });
    }
};
//# sourceMappingURL=user.js.map