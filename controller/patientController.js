const Patient = require("../models/PatientModel");


exports.createPatient = async (req, res) => {
    try {
        const { name, age, gender, contact, address } = req.body;

        // Check required fields
        if (!name || !age || !gender || !contact) {
            return res.status(400).json({ message: "Name, age, gender, and contact are required." });
        }

        // 🔍 Check for existing patient with the same name & contact
        const existingPatient = await Patient.findOne({ name, contact });
        if (existingPatient) {
            return res.status(400).json({
                message: "A patient with this name and contact already exists.",
                patientId: existingPatient._id // Return the existing patient's ID
            });
        }

        // ✅ If no duplicate, create new patient
        const newPatient = new Patient({ name, age, gender, contact, address });
        await newPatient.save();

        res.status(201).json({
            message: "Patient created successfully.",
            patient: newPatient
        });
    } catch (error) {
        console.error("Error creating patient:", error);
        res.status(500).json({ message: "Error creating patient.", error });
    }
};


// ✅ Get all patients
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 }); // Sort by newest first
        res.status(200).json(patients);
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ message: "Error fetching patients.", error });
    }
};

// ✅ Get a single patient by ID
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }
        res.status(200).json(patient);
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ message: "Error fetching patient.", error });
    }
};

// ✅ Update patient details
exports.updatePatient = async (req, res) => {
    try {
        const { name, age, gender, contact, address } = req.body;
        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            { name, age, gender, contact, address },
            { new: true, runValidators: true }
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        res.status(200).json({ message: "Patient updated successfully.", patient: updatedPatient });
    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ message: "Error updating patient.", error });
    }
};

// ✅ Delete a patient
exports.deletePatient = async (req, res) => {
    try {
        const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
        if (!deletedPatient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        res.status(200).json({ message: "Patient deleted successfully." });
    } catch (error) {
        console.error("Error deleting patient:", error);
        res.status(500).json({ message: "Error deleting patient.", error });
    }
};

// ✅ Search patients by name or contact
exports.searchPatients = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Search query is required." });
        }

        const patients = await Patient.find({
            $or: [
                { name: new RegExp(query, "i") }, // Case-insensitive name search
                { contact: new RegExp(query, "i") } // Search by contact number
            ]
        });

        res.status(200).json(patients);
    } catch (error) {
        console.error("Error searching patients:", error);
        res.status(500).json({ message: "Error searching patients.", error });
    }
};
