const Parameter = require("../models/ParameterModel");

exports.createParameter = async (req, res) => {
  try {
    const { 
      parameterName, 
      unit, 
      isQualitative = false, 
      qualitativeOptions = [], 
      referenceType, 
      generalRange, 
      genderBasedRanges, 
      ageBasedRanges 
    } = req.body;

    // Validate required fields
    if (!parameterName || !unit || !referenceType) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Initialize parameter data
    let parameterData = { 
      parameterName, 
      unit, 
      isQualitative, 
      qualitativeOptions, 
      referenceType 
    };

    // Validate reference type and corresponding data
    if (referenceType === "generalRange") {
      if (!generalRange || generalRange.min === undefined || generalRange.max === undefined) {
        return res.status(400).json({ message: "General range is required with min and max values." });
      }
      parameterData.generalRange = {
        min: generalRange.min,
        max: generalRange.max,
        criticalLow: generalRange.criticalLow || null,
        criticalHigh: generalRange.criticalHigh || null
      };
    } else if (referenceType === "genderBasedRanges") {
      if (!Array.isArray(genderBasedRanges) || genderBasedRanges.length === 0) {
        return res.status(400).json({ message: "Gender-based ranges are required." });
      }
      genderBasedRanges.forEach((range) => {
        if (!range.gender || range.min === undefined || range.max === undefined) {
          throw new Error("Each gender range must include gender, min, and max values.");
        }
      });
      parameterData.genderBasedRanges = genderBasedRanges;
    } else if (referenceType === "ageBasedRanges") {
      if (!Array.isArray(ageBasedRanges) || ageBasedRanges.length === 0) {
        return res.status(400).json({ message: "Age-based ranges are required." });
      }
      ageBasedRanges.forEach((range) => {
        if (!range.ageGroup || range.min === undefined || range.max === undefined) {
          throw new Error("Each age range must include ageGroup, min, and max values.");
        }
      });
      parameterData.ageBasedRanges = ageBasedRanges;
    } else {
      return res.status(400).json({ message: "Invalid reference type." });
    }

    // Create and save the parameter
    const newParameter = new Parameter(parameterData);
    await newParameter.save();

    return res.status(201).json({ message: "Parameter created successfully.", parameter: newParameter });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
