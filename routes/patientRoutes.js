const express = require("express");
const router = express.Router();
const patientController = require("../controller/patientController");

router.post("/create-patient", patientController.createPatient); // Create patient
router.get("/get-all-patient", patientController.getAllPatients); // Get all patients
router.get("/:id", patientController.getPatientById); // Get patient by ID
router.put("/update-patient/:id", patientController.updatePatient); // Update patient
router.delete("/delete-patient/:id", patientController.deletePatient); // Delete patient
router.get("/search", patientController.searchPatients); // Search patients

module.exports = router;
