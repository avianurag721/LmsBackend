const Review = require("../models/reviewModel");

const createReview = async (req, res) => {
  try {
    const { product, user, rating, comment } = req.body;

    // Check if user has already reviewed the product
    const existingReview = await Review.findOne({ product, user });
    if (existingReview) {
      return res.status(400).json({ message: "User has already reviewed this product." });
    }

    const newReview = new Review({ product, user, rating, comment });
    const savedReview = await newReview.save();

    res.status(201).json({ success: true, data: savedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email") // Populate user details if needed
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment, updatedAt: Date.now() },
      { new: true } 
    );

    if (!updatedReview) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    res.status(200).json({ success: true, data: updatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    res.status(200).json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createReview, getProductReviews, updateReview, deleteReview };
