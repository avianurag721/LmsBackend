const Patient = require("../models/PatientModel");

exports.createPatient = async (req, res) => {
  try {
    const { prefix, name, dob, age, ageUnit, gender, contact, address } =
      req.body;
    console.log(prefix, name, dob, age, ageUnit, gender, contact, address);

    // ✅ Validate Required Fields
    if (!prefix || !name || !gender || !contact) {
      return res
        .status(400)
        .json({ message: "Prefix, Name, Gender, and Contact are required." });
    }

    if (!dob && (!age || !ageUnit)) {
      return res.status(400).json({
        message:
          "Either Date of Birth (DOB) or Age (Value & Unit) is required.",
      });
    }

    // ✅ Check if Patient Already Exists (Case-Insensitive)
    const existingPatient = await Patient.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      contact,
    }).lean();

    if (existingPatient) {
      return res.status(400).json({
        message: "A patient with this name and contact already exists.",
        patientId: existingPatient._id,
      });
    }

    // ✅ Construct Patient Data
    const patientData = {
      prefix,
      name,
      gender,
      contact,
      address,
    };

    if (dob) {
      patientData.dob = new Date(dob); // Store DOB
    } else {
      patientData.age = { value: age, unit: ageUnit }; // Store Age (Years, Months, Days)
    }

    // ✅ Create New Patient
    const newPatient = await Patient.create(patientData);

    res.status(201).json({
      message: "Patient created successfully.",
      patient: newPatient,
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

    res.status(200).json({
      message: "Patient updated successfully.",
      patient: updatedPatient,
    });
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

exports.searchPatients = async (req, res) => {
  try {
    const query = req.query.query?.trim(); // Trim spaces from input

    if (!query) {
      return res.status(400).json({ message: "Search query is required." });
    }

    // Search patients by name or contact (case-insensitive)
    const patients = await Patient.find({
      $or: [
        { name: new RegExp(query, "i") },
        { contact: new RegExp(query, "i") },
      ],
    })
      .limit(10) // Limit results
      .lean(); // Return plain objects for better performance

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error searching patients:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
