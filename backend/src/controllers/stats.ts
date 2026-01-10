import { TryCatch } from "../middleware/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { nodeCache } from "../server.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats;
  if (nodeCache.has("stats"))
    stats = JSON.parse(nodeCache.get("stats") as string);
  else {
    const today = new Date();

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const LastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    const thisMonthProductsPromise = await Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
   
    const lastMonthProductsPromise = await Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

        const thisMonthUsersPromise = await User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
   
    const lastMonthUsersPromise = await User.find({
      createdAt: {
        $gte: thisMonthUser
        $lte: thisMonth.end,
      },
    });
    const startofThisYear = new Date(today.getFullYear(), 0, 1);
    const startofLastYear = new Date(today.getFullYear() - 1, 0, 1);
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPieCharts = TryCatch(async (req, res, next) => {
  let stats;
  if (nodeCache.has("stats"))
    stats = JSON.parse(nodeCache.get("stats") as string);

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getBarCharts = TryCatch(async (req, res, next) => {
  let stats;
  if (nodeCache.has("stats"))
    stats = JSON.parse(nodeCache.get("stats") as string);

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getLineCharts = TryCatch(async (req, res, next) => {
  let stats;
  if (nodeCache.has("stats"))
    stats = JSON.parse(nodeCache.get("stats") as string);

  return res.status(200).json({
    success: true,
    stats,
  });
});
