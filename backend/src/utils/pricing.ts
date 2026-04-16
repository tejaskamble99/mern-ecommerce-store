import mongoose from "mongoose";
import { Coupon } from "../models/coupon.js";
import { Product } from "../models/product.js";
import { OrderItemType } from "../types/types.js";
import ErrorHandler from "./utility-class.js";

const FREE_SHIPPING_THRESHOLD = 1000;
const SHIPPING_CHARGE = 200;
const TAX_RATE = 0;

type PricedOrder = {
  orderItems: OrderItemType[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  couponCode?: string;
};

const getQuantityMap = (items: OrderItemType[]) => {
  const quantityByProduct = new Map<string, number>();

  for (const item of items) {
    const productId = String(item.productId);
    const quantity = Number(item.quantity);

    if (!mongoose.isValidObjectId(productId)) {
      throw new ErrorHandler("Invalid product id", 400);
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new ErrorHandler("Invalid product quantity", 400);
    }

    quantityByProduct.set(
      productId,
      (quantityByProduct.get(productId) || 0) + quantity
    );
  }

  return quantityByProduct;
};

export const calculateOrderPricing = async (
  items: OrderItemType[],
  couponCode?: string
): Promise<PricedOrder> => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ErrorHandler("Order must contain at least one item", 400);
  }

  const quantityByProduct = getQuantityMap(items);
  const products = await Product.find({
    _id: { $in: [...quantityByProduct.keys()] },
  });

  if (products.length !== quantityByProduct.size) {
    throw new ErrorHandler("Product not found", 404);
  }

  let subtotal = 0;
  const orderItems: OrderItemType[] = products.map((product) => {
    const productId = String(product._id);
    const quantity = quantityByProduct.get(productId)!;
    const price = Number(product.salePrice || product.price);

    if (product.stock < quantity) {
      throw new ErrorHandler(`${product.name} out of stock`, 400);
    }

    subtotal += price * quantity;

    return {
      name: product.name,
      photo: product.photo,
      price,
      quantity,
      productId,
    };
  });

  let discount = 0;
  let appliedCouponCode: string | undefined;

  if (couponCode?.trim()) {
    const normalizedCoupon = couponCode.trim().toUpperCase();
    const coupon = await Coupon.findOne({ coupon: normalizedCoupon });

    if (!coupon) {
      throw new ErrorHandler("Invalid Coupon Code", 400);
    }

    let applicableSubtotal = subtotal;

    if (coupon.productId) {
      const productId = String(coupon.productId);
      const item = orderItems.find((orderItem) => orderItem.productId === productId);

      if (!item) {
        throw new ErrorHandler("Coupon is not applicable to this cart", 400);
      }

      applicableSubtotal = item.price * item.quantity;
    }

    if (coupon.type === "percent") {
      if (coupon.amount < 0 || coupon.amount > 100) {
        throw new ErrorHandler("Invalid coupon discount", 400);
      }

      discount = Math.round(applicableSubtotal * (coupon.amount / 100));
    } else {
      discount = coupon.amount;
    }

    discount = Math.max(0, Math.min(discount, applicableSubtotal, subtotal));
    appliedCouponCode = coupon.coupon;
  }

  const tax = Math.round(subtotal * TAX_RATE);
  const shippingCharges = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const total = Math.max(0, Math.round(subtotal + tax + shippingCharges - discount));

  return {
    orderItems,
    subtotal,
    tax,
    shippingCharges,
    discount,
    total,
    couponCode: appliedCouponCode,
  };
};
