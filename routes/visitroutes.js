const express = require("express");
const router = express.Router();
const visitController = require("../controller/VisitController");
const { getAdminDashboard } = require("../controller/PaymentRelated/RevenewRelated");

router.post("/register", visitController.registerVisit);
router.put("/status", visitController.updateVisitStatus);
router.put("/collect-sample", visitController.collectSample);
router.put("/verify", visitController.verifyTest);
router.put("/generate-report", visitController.generateReport);
router.put("/send-report", visitController.sendReport);
router.put("/update-payment", visitController.updatePaymentStatus);
router.get("/dashboard", getAdminDashboard);
router.put("/update-payment/:visitId", visitController.updatePayment);
router.post("/cancel-visit/:visitId", visitController.cancelVisit);


module.exports = router;
