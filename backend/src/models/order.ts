import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    shippingInfo: {
      fullName: {
        type: String,
        required: [true, "Please enter address"],
        trim: true,
      },
      address: {
        type: String,
        required: [true, "Please enter address"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "Please enter city"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "Please enter state"],
        trim: true,
      },
      country: {
        type: String,
        required: [true, "Please enter country"],
        trim: true,
      },
      pinCode: {
        type: Number,
        required: [true, "Please enter pinCode"],
      },
    },

    user: {
      type: String,
      ref: "User",
      required: [true, "Order must belong to a user"],
    },

    subtotal: {
      type: Number,
      required: [true, "Please enter subtotal"],
    },
    tax: {
      type: Number,
      required: [true, "Please enter tax amount"],
    },

    shippingCharges: {
      type: Number,
      required: [true, "Please enter shipping charges"],
      default: 0,
    },

    discount: {
      type: Number,
      required: [true, "Please enter discount amount"],
      default: 0,
    },

    total: {
      type: Number,
      required: [true, "Please enter total amount"],
    },

    paymentMethod: {
      type: String,
      enum: ["Stripe", "COD", "Razorpay"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentInfo: {
      gateway: String,
      paymentId: String,
      gatewayOrderId: String,
      signature: String,
    },
    couponCode: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    
    trackingId: {
      type: String,
    },

    orderItems: [
      {
        name: {
          type: String,
          required: [true, "Please enter product name"],
          trim: true,
        },
        photo: {
          type: String,
          required: [true, "Please enter product image URL"],
        },
        price: {
          type: Number,
          required: [true, "Please enter price"],
        },
        quantity: {
          type: Number,
          required: [true, "Please enter quantity"],
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product ID is required"],
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Order = mongoose.model("Order", schema);
