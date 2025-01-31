const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  images:[{type: String }],
  productDescription: { type: String },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Links to reviews
  averageRating: { type: Number, default: 0 }, // Cached average rating
  totalReviews: { type: Number, default: 0 }, // Cached total review count
});

module.exports = mongoose.model("Product", productSchema);
