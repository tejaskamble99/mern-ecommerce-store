import { TryCatch } from "../middleware/error.js";
import { Product } from "../models/product.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Request } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { nodeCache } from "../server.js";
import { invalidateCache } from "../utils/features.js";

export const getlatestProduct = TryCatch(async (req, res, next) => {
  let products = [];
  if (nodeCache.has("latest-products"))
    products = JSON.parse(nodeCache.get("latest-products") as string);
  else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    nodeCache.set("latest-products", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories = [];
  if (nodeCache.has("categories"))
    categories = JSON.parse(nodeCache.get("categories") as string);
  else {
    categories = await Product.distinct("category");
    nodeCache.set("categories", JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getCategoriesWithImage = TryCatch(async (req, res, next) => {
  let categories;

  if (nodeCache.has("categories-with-image")) {
    categories = JSON.parse(nodeCache.get("categories-with-image") as string);
  } else {
   
    const categoryNames = await Product.distinct("category");

    
    categories = await Promise.all(
      categoryNames.map(async (category) => {
        const product = await Product.findOne({ category }).select("category photo");
        return {
          category,
          image: product?.photo || "",
        };
      })
    );

    nodeCache.set("categories-with-image", JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});


export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, category, sort, price } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search) baseQuery.name = { $regex: search, $options: "i" };
    if (category) baseQuery.category = category;
    if (price) baseQuery.price = { $lte: Number(price) };

    const [products, totalFilteredCount] = await Promise.all([
      Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip),
      Product.countDocuments(baseQuery),
    ]);

    const totalPage = Math.ceil(totalFilteredCount / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);

export const getAdminProduct = TryCatch(async (req, res, next) => {
  let products;
  if (nodeCache.has("all-Products")) {
    products = JSON.parse(nodeCache.get("all-Products") as string);
  } else {
    // FIX 1: removed `const` — was shadowing outer `products`, always returned undefined
    products = await Product.find({});
    nodeCache.set("all-Products", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const  getSingleProduct = TryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id;
  if (nodeCache.has(`product-${id}`))
    product = JSON.parse(nodeCache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Product not found", 404));
    nodeCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, description, category } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please upload photo", 400));

    if (!name || !price || !stock || !description || !category) {
      rm(photo.path, () => {
        console.log("file deleted");
      });
      return next(new ErrorHandler("Please enter all fields", 400));
    }

    await Product.create({
      name,
      price,
      stock,
      description,
      category: category.toLowerCase(),
      photo: photo.path,
    });

    invalidateCache({ product: true, admin: true });

    return res.status(200).json({
      success: true,
      message: "Product created successfully",
    });
  }
);

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, description, category } = req.body;
  const photo = req.file;

  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  if (photo) {
    rm(photo.path, (err) => {
  if (err) console.error(err);
});
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (description) product.description = description;
  if (category) product.category = category.toLowerCase();

  await product.save();
  invalidateCache({ product: true, productId: String(product._id), admin: true });

  return res.status(200).json({
    success: true,
    message: "Product Updated successfully",
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  rm(product.photo!, () => {});

 
  await product.deleteOne();
  invalidateCache({ product: true, productId: String(product._id), admin: true });

  return res.status(200).json({
    success: true,
    message: "Product Deleted successfully",
  });
});