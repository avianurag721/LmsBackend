const parameterSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  parameterName: { type: String, required: true },
  unit: { type: String },
  isQualitative: { type: Boolean, default: false },
  qualitativeOptions: [{ type: String }], 
  referenceType: { type: String, enum: ["General", "GenderBased", "AgeBased"], required: true },
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
