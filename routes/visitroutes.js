const express = require("express");
const router = express.Router();
const visitController = require("../controller/VisitController");

router.post("/register", visitController.registerVisit);
router.put("/status", visitController.updateVisitStatus);
router.put("/collect-sample", visitController.collectSample);
router.put("/verify", visitController.verifyTest);
router.put("/generate-report", visitController.generateReport);
router.put("/send-report", visitController.sendReport);
router.put("/update-payment", visitController.updatePaymentStatus);

module.exports = router;
