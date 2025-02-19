const express = require("express");
const router = express.Router();
const {createUnit}=require("../controller/unitsController")
router.post("/create-unit",createUnit)


module.exports = router;