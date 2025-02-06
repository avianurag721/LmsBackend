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



  
