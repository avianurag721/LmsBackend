const express = require("express");
const router = express.Router();
const {createUnit, getAllUnit, editUnit}=require("../controller/unitsController");
router.post("/create-unit",createUnit)
router.get("/get-all-unit",getAllUnit)
router.patch("/edit-unit",editUnit)


module.exports = router;