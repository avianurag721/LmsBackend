const express = require("express");
const router = express.Router();
const {createParameter}=require("../controller/parameterController")
router.post("/create-parameter",createParameter)


module.exports = router;