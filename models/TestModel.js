const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  testName: { type: String, required: true, unique: true, trim: true }, // Essential
  testCode: { type: String, unique: true, trim: true }, // Unique but not required
  category: { type: String, enum: ["Blood Test", "Urine Test", "Imaging", "Other"], required: true }, // Important for classification
  parameters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Parameter" }], 
  sampleType: { type: String, enum: ["Blood", "Urine", "Saliva", "Tissue", "Other"] }, 
  turnaroundTime: { type: String, trim: true }, 
  description: { type: String, trim: true }, 
  price: { type: Number, required: true, min: 0 }, 
  discount: { type: Number, default: 0, min: 0, max: 100 }, 
  footNote: { type: String, trim: true }, 
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
}, { timestamps: true });

module.exports = mongoose.model("Test", testSchema);
