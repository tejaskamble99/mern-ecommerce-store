import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  images: [{ url: String }],
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name"],
    },
    photo: {
      type: String,
      required: [true, "Please enter photo"],
    },
    photos: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      required: [true, "Please enter price"],
    },

    salePrice: {
      type: Number,
      default: null,
    },
    stock: {
      type: Number,
      required: [true, "Please enter stock"],
    },
    description: {
      type: String,
      required: [true, "Please enter description"],
    },
    category: {
      type: String,
      required: [true, "Please enter category"],
      trim: true,
      lowercase: true,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    seo: {
      metaTitle: {
        type: String,
        default: "",
        trim: true,
      },
      metaDescription: {
        type: String,
        default: "",
        trim: true,
      },
      slug: {
        type: String,
        trim: true,
        lowercase: true,
        sparse: true, // allows multiple null values
      },
      keywords: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
    strict: true,

    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

schema.virtual("discountPercent").get(function (this: any) {
  if (!this.salePrice) return 0;
  return Math.round(((this.price - this.salePrice) / this.price) * 100);
});

schema.methods.calculateRatings = function () {
  if (this.reviews.length === 0) {
    this.ratings = 0;
    this.numOfReviews = 0;
    return;
  }
  const total = this.reviews.reduce(
    (sum: number, r: { rating: number }) => sum + r.rating,
    0,
  );
  this.ratings = Number((total / this.reviews.length).toFixed(1));
  this.numOfReviews = this.reviews.length;
};

schema.index({ category: 1 });
schema.index({ price: 1 });
schema.index({ createdAt: -1 });
schema.index({ ratings: -1 });
schema.index({ name: "text" });
schema.index({ "seo.slug": 1 }, { sparse: true });

export const Product = mongoose.model("Product", schema);
