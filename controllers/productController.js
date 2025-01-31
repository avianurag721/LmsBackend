const mongoose = require("mongoose");
const Product = require("../models/productModel");

const createProduct = async (req, res) => {
  try {
    const { productName, price, productDescription, specification } = req.body;
    console.log(productName);
    let imageUrl = [];
    if (req.fileLocations) {
      imageUrl = req.fileLocations;
    }
    if (!productName || !price || !productDescription) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the mandatory fields.",
      });
    }

    const newProd = await Product.create({
      productName,
      price,
      images:imageUrl,
      productDescription,
      specification,
    });

    // Respond with success
    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: newProd,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
const getAllProduct = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    if (!allProducts) {
      return res.status(400).json({
        success: false,
        message: "No products found",
      });
    }
    // Respond with success
    return res.status(201).json({
      success: true,
      message: "All Products fetched successfully.",
      product: allProducts,
    });
  } catch (error) {
    console.error("Error while fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
const getLatestProduct = async (req, res) => {
  try {
    const allProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(10);
    if (!allProducts) {
      return res.status(400).json({
        success: false,
        message: "No products found",
      });
    }
    // Respond with success
    return res.status(201).json({
      success: true,
      message: "All Products fetched successfully.",
      product: allProducts,
    });
  } catch (error) {
    console.error("Error while fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
const getProductDetailsbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "No product Details found for the requested Product",
      });
    }
    // Respond with success
    return res.status(201).json({
      success: true,
      message: "Product Details fetched successfully.",
      product: product,
    });
  } catch (error) {
    console.error("Error while fetching product details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getLatestProduct,
  getProductDetailsbyId,
};
