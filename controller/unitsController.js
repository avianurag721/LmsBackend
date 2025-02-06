const Unit = require("../models/unitModel");

exports.createUnit = async (req, res) => {
  try {
    const { unit } = req.body;
    const savedUnit = await Unit.create({unit});
    return res.status(200).json({
      success: true,
      message: "Unit Created successfully",
    });
  } catch (error) {
    return res.status(402).json({
        success:false,
        message:error.message
    })
  }
};
exports.getAllUnit = async (req, res) => {
  try {
    const units = await Unit.find({});
    return res.status(200).json({
      success: true,
      units,
      message: "Unit fetched successfully",
    });
  } catch (error) {
    return res.status(402).json({
        success:false,
        message:error.message
    })
  }
};
exports.editUnit = async (req, res) => {
    try {
      const { unit, id } = req.body;
  
      // Ensure ID is provided
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Unit ID is required",
        });
      }
  
      const updatedUnit = await Unit.findByIdAndUpdate(id, { unit }, { new: true, runValidators: true });
  
      if (!updatedUnit) {
        return res.status(404).json({
          success: false,
          message: "Unit not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        updatedUnit,
        message: "Unit edited successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};

exports.bulkInsertUnits = async (req, res) => {
  try {
    const unitData = [
      "uL", "µIU/ML", "µg/ML", "10^6/uL", "10^3/uL", "mg", "IU", "µg/L", ".", "g/L",
      "/HPF", "Mill/ml", "mosm/kg", "ml/day", "uIU/mL", "ug/dl", "mmol/24 Hrs", "milli/cu-mm",
      "mIU/ml", "UNIT", "MILL/CUMM", "PEI U/ml", "S/CO", "gm%", "mm/hr", "OD Units", "A/C.O",
      "co/s", "mEq/L", "pg/ml", "ng/dl", "mm", "Million", "Days", "ml/hr", "l/24 hrs",
      "Clear", "Negative <1.00, Positive >= 1.00", "ng/ml", "IU/ml", "U/ml", "ml",
      "Upto 30 min", "> 50 %", "mg/24 hr", "cells/cu mm", "mmol/l", "mEq/day", "mg/l",
      "U/gHb", "gm/l", "lakh/cu mm", "Present", "Absent", "Negative", "Positive",
      "mcg/mg creatinine", "ug/l", "RU/ml", "ng/L", "mg %", "Full Quantity", "ng/ml",
      "K/mcL", "U/L", "mg/L", "Lakhs/cumm", "Cells/cumm", "mIU/L", "mg/24 hr", "Min",
      "mg/day", "Test", "-", "ng/mL", "µg/dL", "µmol/L", "RBC", "ML", "Seconds",
      "mmol/L", "uml", "ml", "NA", "gm/dl", "cells/mcL", "%", "mcL", "mg/dL", "mcg",
      "IU/mL", "IU/L", "pg", "mEq", "g/dL"
    ];

    // Remove duplicates from the list
    const uniqueUnits = [...new Set(unitData)].map(unit => ({ unit }));

    // Check existing units in the database
    const existingUnits = await Unit.find({ unit: { $in: unitData } }).select("unit");

    const existingUnitNames = existingUnits.map(u => u.unit);

    // Filter out units that already exist in the database
    const newUnits = uniqueUnits.filter(u => !existingUnitNames.includes(u.unit));

    if (newUnits.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No new units to insert. All units already exist.",
      });
    }
    console.log(newUnits)

    // Insert only new units
    await Unit.insertMany(newUnits);

    return res.status(201).json({
      success: true,
      message: "Units inserted successfully",
      insertedCount: newUnits.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  
