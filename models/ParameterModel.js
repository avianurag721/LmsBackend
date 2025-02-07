const mongoose=require("mongoose")

const parameterSchema = new mongoose.Schema({
  parameterName: { type: String, required: true },
  unit: { type: String },
  isQualitative: { type: Boolean, default: false },
  qualitativeOptions: [{ type: String }], 
  referenceType: { type: String, enum: ["generalRange", "genderBasedRanges", "ageBasedRanges"], required: true },
  generalRange: {
    min: { type: Number },
    max: { type: Number },
    criticalLow: { type: Number },
    criticalHigh: { type: Number },
  },
  genderBasedRanges: [
    {
      gender: { type: String },
      min: { type: Number },
      max: { type: Number },
      criticalLow: { type: Number },
      criticalHigh: { type: Number },
    },
  ],
  ageBasedRanges: [
    {
      ageGroup: { type: String },
      min: { type: Number },
      max: { type: Number },
      criticalLow: { type: Number },
      criticalHigh: { type: Number },
    },
  ],
});


module.exports=mongoose.model("Parameter",parameterSchema)