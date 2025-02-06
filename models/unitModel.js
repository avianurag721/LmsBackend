const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema(
  {
    unit: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Corrected timestamp option
);

module.exports = mongoose.model("Unit", unitSchema);
