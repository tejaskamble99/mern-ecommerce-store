export const errorMiddleware = (err, req, res, next) => {
    err.message || (err.message = "something went wrong");
    err.statusCode || (err.statusCode = 500);
    return res.status(err.statusCode).json({
        success: true,
        message: err.message,
    });
};
export const TryCatch = (func) => {
    return (req, res, next) => {
        return Promise.resolve(func(req, res, next)).catch(next);
    };
};
//# sourceMappingURL=error.js.map