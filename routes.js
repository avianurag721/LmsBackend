const express=require("express")
const parameterRoutes=require('./routes/parameterRoutes')
const unitRoutes=require('./routes/unitRouters')
const visitRoutes=require('./routes/visitroutes')
const testRoutes=require('./routes/testRoutes')
const patientRoutes=require('./routes/patientRoutes')

const router=express.Router()

router.use('/parameter',parameterRoutes)
router.use('/unit',unitRoutes)
router.use('/test',testRoutes)
router.use('/patient',patientRoutes)
router.use('/visit',visitRoutes)


module.exports = router;



