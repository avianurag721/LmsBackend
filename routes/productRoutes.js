const express=require('express');
const { getAllProduct, createProduct, getLatestProduct ,getProductDetailsbyId} = require('../controllers/productController');
const router = express.Router();
const {uploadToS3}=require("../config/s3Setup")

router.post('/create-product',uploadToS3, createProduct);
router.get('/get-all-product', getAllProduct);
router.get('/get-latest-product', getLatestProduct);
router.get('/get-product-details/:id', getProductDetailsbyId);


module.exports = router;


