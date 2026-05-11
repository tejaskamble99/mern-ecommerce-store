import ErrorHandler from "./utility-class.js";
import { ShippingInfoType } from "../types/types.js";

const textFields = ["address", "city", "state", "country"] as const;

const normalizeText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export const validateShippingInfo = (shippingInfo: unknown): ShippingInfoType => {
  if (!shippingInfo || typeof shippingInfo !== "object") {
    throw new ErrorHandler("Shipping information is required", 400);
  }

  const input = shippingInfo as Record<string, unknown>;
  const fullName = normalizeText(input.fullName);
  const phone = String(input.phone ?? "").trim();
  const pinCode = String(input.pinCode ?? "").trim();

  if (fullName.length < 2 || fullName.length > 80) {
    throw new ErrorHandler("Recipient name must be between 2 and 80 characters", 400);
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    throw new ErrorHandler("Please enter a valid 10-digit phone number", 400);
  }

  if (!/^\d{6}$/.test(pinCode)) {
    throw new ErrorHandler("Please enter a valid 6-digit pin code", 400);
  }

  for (const field of textFields) {
    const value = normalizeText(input[field]);
    const minLength = field === "address" ? 8 : 2;
    const maxLength = field === "address" ? 200 : 80;

    if (value.length < minLength || value.length > maxLength) {
      throw new ErrorHandler(
        `${field} must be between ${minLength} and ${maxLength} characters`,
        400,
      );
    }
  }

  return {
    fullName,
    phone: Number(phone),
    address: normalizeText(input.address),
    city: normalizeText(input.city),
    state: normalizeText(input.state),
    country: normalizeText(input.country),
    pinCode: Number(pinCode),
  };
};
