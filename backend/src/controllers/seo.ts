import { SEO } from "../models/seo.js";
import { TryCatch } from "../middleware/error.js";

export const getSEO = TryCatch(async (req, res) => {
  const { page } = req.params;

  const seo = await SEO.findOne({ page });

  res.json({
    success: true,
    seo
  });
});

export const updateSEO = TryCatch(async (req, res) => {
  const { page } = req.params;

  const seo = await SEO.findOneAndUpdate(
    { page },
    req.body,
    { upsert: true, new: true }
  );

  res.json({
    success: true,
    seo
  });
});