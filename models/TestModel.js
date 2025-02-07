const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
    testName: { type: String, required: true, unique: true, trim: true }, // Essential
    testCode: { type: String, unique: true, trim: true }, // Unique but not required
    category: { type: String, enum: ["Blood Test", "Urine Test", "Imaging", "Other"], required: true }, // Important for classification
    parameters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Parameter" }], // Optional, since some tests might not have parameters
    sampleType: { type: String, enum: ["Blood", "Urine", "Saliva", "Tissue", "Other"] }, // Optional
    turnaroundTime: { type: String, trim: true }, // Optional
    description: { type: String, trim: true }, // Optional
    price: { type: Number, required: true, min: 0 }, // Essential for billing
    discount: { type: Number, default: 0, min: 0, max: 100 }, // Optional
    referenceRanges: { type: String, trim: true }, // Optional
    footNote: { type: String, trim: true }, // Optional
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }, // Optional but useful
}, { timestamps: true });

module.exports = mongoose.model("Test", testSchema);
