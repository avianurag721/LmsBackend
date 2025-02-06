const express=require("express")
const parameterRoutes=require('./routes/parameterRoutes')
const unitRoutes=require('./routes/unitRouters')

const router=express.Router()

router.use('/parameter',parameterRoutes)
router.use('/unit',unitRoutes)


module.exports = router;



