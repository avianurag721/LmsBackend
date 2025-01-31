const express = require('express');
const {createBlog,getBlog,deleteBlog,updateBlog,getBlogById} = require('../controllers/blogsController');
const {uploadToS3}=require('../config/s3Setup');


const router = express.Router();

router.post('/create-blog',uploadToS3, createBlog);
router.put('/update/:id',uploadToS3,updateBlog);
router.get('/getBlog', getBlog);
router.get('/getBlog/:id', getBlogById);
router.delete('/delete/:id', deleteBlog);



module.exports = router;