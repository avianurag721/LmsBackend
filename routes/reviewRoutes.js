const express = require("express");
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/ReviewController");

const router = express.Router();

router.post("/create-review", (req,res)=>{
    console.log("hello")
    return res.status(201).json({message:"req filled"})
});

router.get("get-product-reviews/:productId", getProductReviews);

router.put("update-review/:reviewId", updateReview);

router.delete("delete-review/:reviewId", deleteReview);

module.exports = router;
