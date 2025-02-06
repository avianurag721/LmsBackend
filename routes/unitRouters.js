const express = require("express");
const router = express.Router();
const {createUnit,bulkInsertUnits}=require("../controller/unitsController")
router.post("/create-unit",createUnit)
router.post("/insert-unit",bulkInsertUnits)


module.exports = router;