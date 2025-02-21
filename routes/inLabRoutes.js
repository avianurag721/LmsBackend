const express = require("express");
const router = express.Router();
const visitController = require("../controller/InLab/InLabController");

// ✅ 1. Update Visit Status
router.put("/update-status", visitController.updateVisitStatus);

// ✅ 2. Collect Sample
router.get("/pending-visit", visitController.getAllNewVisits);
router.put("/collect-sample", visitController.collectSample);

// ✅ 3. Verify Test
router.put("/verify-test", visitController.verifyTest);

// ✅ 4. Add Test Results
router.post("/add-results/:visitId", visitController.addTestResults);

// ✅ 5. Update Test Results
router.put("/update-results/:visitId/:resultId", visitController.updateTestResults);

// ✅ 6. Get Test Results for a Visit
router.get("/get-results/:visitId", visitController.getTestResults);

// ✅ 7. Delete Test Result
router.delete("/delete-result/:visitId/:resultId", visitController.deleteTestResult);

// ✅ 8. Generate Report
router.post("/generate-report", visitController.generateReport);

// ✅ 9. Send Report to Patient
router.post("/send-report", visitController.sendReport);

module.exports = router;
