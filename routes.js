const express=require("express")
const userAuthRoutes=require('./routes/usersRoutes')
const productRoutes=require('./routes/productRoutes')
const userProfileRoutes=require('./routes/userProfileRoutes')
const blogRoutes=require('./routes/blogRoutes')
const faqRoutes=require('./routes/faqRoutes')
const reviewRoutes=require('./routes/reviewRoutes')
const router=express.Router()

router.use('/user',userAuthRoutes)
router.use('/user/profile',userProfileRoutes)
router.use('/product',productRoutes)
router.use('/blogs',blogRoutes)
router.use('/faqs',faqRoutes)
router.use('/reviews',reviewRoutes)

module.exports = router;



