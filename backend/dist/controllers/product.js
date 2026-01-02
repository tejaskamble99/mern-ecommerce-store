import { TryCatch } from "../middleware/error.js";
import { Product } from "../models/product.js";
import ErrorHandeler from "../utils/utility-class.js";
import { rm } from "fs";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, description, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandeler("Please upload photo", 400));
    if (!name || !price || !stock || !description || !category) {
        rm(photo.path, () => {
            console.log("file deleted");
        });
        return next(new ErrorHandeler("Please enter all fields", 400));
    }
    await Product.create({
        name,
        price,
        stock,
        description,
        category: category.toLowerCase(),
        photo: photo?.path,
    });
    return res.status(200).json({
        success: true,
        message: "Product created successfully",
    });
});
export const getlatestProduct = TryCatch(async (req, res, next) => {
    const product = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    return res.status(200).json({
        success: true,
        product,
    });
});
//# sourceMappingURL=product.js.map