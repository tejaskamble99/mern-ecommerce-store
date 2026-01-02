import { User } from "../models/user.js";
import ErrorHandeler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
// admin only access
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id)
        return next(new ErrorHandeler("Please login", 401));
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandeler("Invalid user", 401));
    if (user.role !== "admin")
        return next(new ErrorHandeler("Unauthorize access", 403));
    next();
});
//# sourceMappingURL=auth.js.map