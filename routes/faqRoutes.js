const express = require('express');
const {createFAQ,getFAQs,updateFAQ,deleteFAQ} = require('../controllers/FAQcontroller');
const {uploadToS3}=require('../config/s3Setup');


const router = express.Router();

router.post('/create-faq', createFAQ);
router.get('/getFAQs', getFAQs);
router.patch('/update-faq/:id', updateFAQ);
router.delete('/delete-faq/:id', deleteFAQ);



module.exports = router;