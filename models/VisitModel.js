const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    tests:[{ type: mongoose.Schema.Types.ObjectId, ref: "Test"}]
  
},{timestamps:true});

module.exports = mongoose.model("Patient", patientSchema);
