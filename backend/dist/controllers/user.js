import { User } from "../models/user.js";
export const newUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        return res
            .status(200)
            .json({
            success: true,
            message: `User ${user.name} created successfully`,
            user,
        });
    }
    catch (error) { }
};
//# sourceMappingURL=user.js.map