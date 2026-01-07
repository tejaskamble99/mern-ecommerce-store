import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
// admin only access
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id)
        return next(new ErrorHandler("Please login", 401));
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid user", 401));
    if (user.role !== "admin")
        return next(new ErrorHandler("Unauthorize access", 403));
    next();
});
//# sourceMappingURL=auth.js.map