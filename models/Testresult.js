const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    results: [
      {
        parameterId: { type: mongoose.Schema.Types.ObjectId, ref: "TestParameter", required: true },
        resultValue: { type: String, required: true }
      }
    ],
    remarks: { type: String },
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("TestResult", testResultSchema);
  