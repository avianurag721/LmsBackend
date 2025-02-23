const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  prefix: { type: String, enum: ["Mr.", "Mrs.", "Master", "Miss"], required: true },
  name: { type: String, required: true },

  // Either `dob` or `age` should be provided
  dob: { type: Date }, 
  age: { 
    value: { type: Number, min: 0 }, // Age in numbers
    unit: { type: String, enum: ["Years", "Months", "Days"], default: "Years" }
  },

  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  contact: { type: String, required: true, match: /^[0-9]{10}$/ }, // Ensures 10-digit contact
  address: { type: String },

  createdAt: { type: Date, default: Date.now }
});

// Ensure either age or dob is provided
patientSchema.pre("save", function (next) {
  if (!this.dob && (!this.age || !this.age.value)) {
    return next(new Error("Either Date of Birth (dob) or Age (value) is required."));
  }
  next();
});

module.exports = mongoose.model("Patient", patientSchema);
