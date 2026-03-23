import { rm } from "fs";
import { TryCatch } from "../middleware/error.js";
import { Banner } from "../models/banners.js";
import { nodeCache } from "../server.js";
import ErrorHandler from "../utils/utility-class.js";

export const getBanners = TryCatch(async (req, res, next) => {
  const { slot } = req.query;

  const key = slot ? `banners-${slot}` : "banners-all";

  let banners;

  if (nodeCache.has(key)) {
    banners = JSON.parse(nodeCache.get(key) as string);
  } else {
    banners = slot
      ? await Banner.find({ slot }).sort({ createdAt: -1 })
      : await Banner.find().sort({ createdAt: -1 });
    nodeCache.set(key, JSON.stringify(banners));
  }

  return res.status(200).json({ success: true, banners });
});

export const addBanner = TryCatch(async (req, res, next) => {
  const photo = req.file;
  const { slot } = req.body;

  if (!photo) return next(new ErrorHandler("Please upload photo", 400));
  if (!slot) return next(new ErrorHandler("Please specify a slot", 400));

  await Banner.create({ image: photo.path, slot });

  nodeCache.del([`banners-${slot}`, "banners-all"]);
  return res
    .status(201)
    .json({ success: true, message: "Banner added successfully" });
});

export const updateBanner = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const photo = req.file;
  const { slot } = req.body;

  if (!photo) return next(new ErrorHandler("Please upload photo", 400));
  if (!slot) return next(new ErrorHandler("Please specify a slot", 400));

  const banner = await Banner.findById(id);
  if (!banner) return next(new ErrorHandler("Banner not found", 404));
  
  const oldSlot = banner.slot;
  rm(banner.image, () => {});

  banner.image = photo.path;
  banner.slot = slot;

  await banner.save();

  nodeCache.del([`banners-${oldSlot}`, `banners-${slot}`, "banners-all"]);

  return res
    .status(200)
    .json({ success: true, message: "Banner updated successfully" });
});

export const deleteBanner = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const banner = await Banner.findById(id);
  if (!banner) return next(new ErrorHandler("Banner not found", 404));

  rm(banner.image, () => {});

  await banner.deleteOne();

  nodeCache.del([`banners-${banner.slot}`, "banners-all"]);

  return res
    .status(200)
    .json({ success: true, message: "Banner deleted successfully" });
});
