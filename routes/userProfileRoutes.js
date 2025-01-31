const express = require("express");
const { updateProfile,updatePassword, addAddress, getAllAddressOfUser, updateAddress,deleteAddress } = require("../controllers/userProfileController");
const router = express.Router();

router.patch("/updateProfile", updateProfile);
router.patch("/updatePassword", updatePassword);
router.post("/addAddress", addAddress);
router.get("/getAllAddressOfUser/:userId", getAllAddressOfUser);
router.patch("/updateAddressOfUser/:id", updateAddress);
router.delete("/deleteAddressOfUser/:addressId", deleteAddress);

module.exports = router;
