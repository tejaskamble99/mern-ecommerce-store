import mongoose from "mongoose";

const schema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    unique: true
  },

  title: String,

  description: String,

  keywords: [String],

  ogImage: String,

  canonical: String
});

export const SEO = mongoose.model("SEO", schema);