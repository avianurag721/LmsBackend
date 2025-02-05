const Parameter = require("../models/ParameterModel");

exports.createParameter = async (req, res) => {
  try {
    const { 
      testId, 
      parameterName, 
      unit, 
      referenceType, 
      generalRange, 
      genderBasedRanges, 
      ageBasedRanges 
    } = req.body;

    // Validate testId, parameterName, unit, and referenceType
    if (!testId || !parameterName || !unit || !referenceType) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate based on referenceType
    let parameterData = { testId, parameterName, unit, referenceType };

    if (referenceType === "General") {
      // Validate generalRange
      if (!generalRange || generalRange.min === undefined || generalRange.max === undefined) {
        return res.status(400).json({ message: "General range is required." });
      }
      parameterData.generalRange = {
        min: generalRange.min,
        max: generalRange.max,
        criticalLow: generalRange.criticalLow || null,
        criticalHigh: generalRange.criticalHigh || null
      };
    } else if (referenceType === "GenderBased") {
      // Validate genderBasedRanges
      if (!genderBasedRanges || !Array.isArray(genderBasedRanges) || genderBasedRanges.length === 0) {
        return res.status(400).json({ message: "Gender-based ranges are required." });
      }
      // Ensure all gender ranges have valid fields
      genderBasedRanges.forEach((range) => {
        if (!range.gender || range.min === undefined || range.max === undefined) {
          throw new Error("Each gender range must include gender, min, and max values.");
        }
      });
      parameterData.genderBasedRanges = genderBasedRanges;
    } else if (referenceType === "AgeBased") {
      // Validate ageBasedRanges
      if (!ageBasedRanges || !Array.isArray(ageBasedRanges) || ageBasedRanges.length === 0) {
        return res.status(400).json({ message: "Age-based ranges are required." });
      }
      // Ensure all age ranges have valid fields
      ageBasedRanges.forEach((range) => {
        if (!range.ageGroup || range.min === undefined || range.max === undefined) {
          throw new Error("Each age range must include ageGroup, min, and max values.");
        }
      });
      parameterData.ageBasedRanges = ageBasedRanges;
    } else {
      return res.status(400).json({ message: "Invalid reference type." });
    }

    // Save the parameter
    const newParameter = new Parameter(parameterData);
    await newParameter.save();

    return res.status(201).json({ message: "Parameter created successfully.", parameter: newParameter });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
