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
import slugify from "slugify";

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
  async (req: Request<{}, {}, any>, res, next) => {
    
    const { 
      name, price, salePrice, stock, description, category,
      metaTitle, metaDescription, slug, keywords 
    } = req.body;
    
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) 
      return next(new ErrorHandler("Please upload at least one photo", 400));

    if (!name || !price || !stock || !description || !category) {
      files.forEach((file) => rm(file.path, () => console.log("deleted")));
      return next(new ErrorHandler("Please enter all fields", 400));
    }

    let discountPercent = 0;
    if (salePrice && Number(salePrice) < Number(price)) {
      discountPercent = Math.round(((Number(price) - Number(salePrice)) / Number(price)) * 100);
    }
    
   
    const finalSlug = slug ? slugify(slug, { lower: true }) : slugify(name, { lower: true });
    
   
    const formattedKeywords = keywords 
      ? keywords.split(",").map((k: string) => k.trim()).filter((k: string) => k !== "")
      : [];
  
    const photosPaths = files.map((file) => file.path);

   
    await Product.create({
      name,
      price,
      salePrice: salePrice || undefined,
      discountPercent,
      stock,
      description,
      category: category.toLowerCase(),
      photo: photosPaths[0], 
      photos: photosPaths,   
      seo: { 
        slug: finalSlug,
        metaTitle: metaTitle || "",
        metaDescription: metaDescription || "",
        keywords: formattedKeywords
      },
    });

    invalidateCache({ product: true, admin: true });

    return res.status(200).json({ success: true, message: "Product created successfully" });
  }
);

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product)
    return next(new ErrorHandler("Product not found", 404));

  const { 
    name, price, salePrice, stock, description, category,
    metaTitle, metaDescription, slug, keywords 
  } = req.body;


  product.seo = product.seo || { metaTitle: "", metaDescription: "", keywords: [], slug: "" };

  if (name) {
    product.name = name;
  
    if (!product.seo.slug && !slug) {
      product.seo.slug = slugify(name, { lower: true });
    }
  }


  if (metaTitle !== undefined) product.seo.metaTitle = metaTitle;
  if (metaDescription !== undefined) product.seo.metaDescription = metaDescription;
  
 
  if (slug) {
    product.seo.slug = slugify(slug, { lower: true });
  }

  // Convert comma-separated string back to an array for MongoDB
  if (keywords !== undefined) {
    product.seo.keywords = keywords.split(",").map((k: string) => k.trim()).filter((k: string) => k !== "");
  }
  
  if (price) product.price = Number(price);
  if (salePrice !== undefined) {
    product.salePrice = salePrice === "" || salePrice === "null" ? null as any : Number(salePrice);
  }
  
  if (stock !== undefined) product.stock = Number(stock);
  if (description) product.description = description;
  if (category) product.category = category.toLowerCase();

  const files = req.files as Express.Multer.File[];
  const existingImages = JSON.parse(req.body.existingImages || "[]");

  if (product.photos && product.photos.length > 0) {
    product.photos.forEach((img) => {
      if (!existingImages.includes(img)) {
        rm(img, () => {});
      }
    });
  }

  product.photos = existingImages;

  if (files && files.length > 0) {
    const newImages = files.map((file) => file.path);
    product.photos.push(...newImages);
  }

  product.photo = product.photos[0] || "";

  if (!product.photo) {
    return next(new ErrorHandler("A product must have at least one photo", 400));
  }

  await product.save();

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));


  if (product.photos && product.photos.length > 0) {
    product.photos.forEach((photoPath) => {
      rm(photoPath, () => {
        console.log("Deleted image:", photoPath);
      });
    });
  } else if (product.photo) {
    // Fallback for very old products
    rm(product.photo, () => {});
  }

  await product.deleteOne();
  invalidateCache({ product: true, productId: String(product._id), admin: true });

  return res.status(200).json({
    success: true,
    message: "Product Deleted successfully",
  });
});
export const addOrUpdateReview = TryCatch(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const user = req.user!;

  const product = await Product.findById(productId);

  if (!product)
    return next(new ErrorHandler("Product not found", 404));

  const images =
    (req.files as Express.Multer.File[])?.map((file) => ({
      url: file.path,
    })) || [];


  const existingReview = product.reviews.find(
    (r) => r.user?.toString() === user._id?.toString()
  );

  if (existingReview) {
    existingReview.rating = Number(rating);
    existingReview.comment = comment;

    if (images.length > 0) existingReview.images = images as any;
  } else {
    product.reviews.push({
      user: user._id,
      name: user.name,
      rating: Number(rating),
      comment,
      images,
    } as any);
  }

  (product as any).calculateRatings();

  await product.save({ validateBeforeSave: false });


  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  res.status(200).json({
    success: true,
    message: "Review submitted successfully",
  });
});

export const getProductReviews = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product)
    return next(new ErrorHandler("Product not found", 404));

  const reviews = product.reviews.sort(
    (a: any, b: any) => b.createdAt - a.createdAt
  );

  res.status(200).json({
    success: true,
    reviews,
    ratings: product.ratings,
    totalReviews: product.numOfReviews,
  });
});

export const deleteReview = TryCatch(async (req, res, next) => {
  const { productId, reviewId } = req.query as {
    productId?: string;
    reviewId?: string;
  };

  if (!productId || !reviewId) {
    return next(new ErrorHandler("productId and reviewId are required", 400));
  }

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  // Find the subdocument by id
  const reviewDoc = product.reviews.id(reviewId);
  if (!reviewDoc) {
    return next(new ErrorHandler("Review not found", 404));
  }

  // Remove it safely
  reviewDoc.deleteOne(); // or reviewDoc.remove() if using older Mongoose

  // Recalculate ratings
  (product as any).calculateRatings?.();

  await product.save({ validateBeforeSave: false });

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});


export const getProductBySlug = TryCatch(async (req, res, next) => {
  const { slug } = req.params;

  if (!slug || slug === "undefined") {
    return res.status(400).json({
      success: false,
      message: "Invalid slug"
    });
  }

  // ✅ FIX: Query the nested path "seo.slug"
  const product = await Product.findOne({ "seo.slug": slug });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  res.status(200).json({
    success: true,
    product
  });
});