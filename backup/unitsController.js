const mongoose = require("mongoose");
const Unit =require("../models/unitModel")
// Define the unit schema
const unitSchema = new mongoose.Schema({
  unitName: { type: String, required: true, unique: true },
});

// Add units function
exports.addUnits = async () => {
    try {
        const units = [
            "uL", "µIU/ML", "µg/ML", "10^6/uL", "10^3/uL", "mg", "IU", "µg/L", ".", "g/L",
            "/HPF", "Mill/ml", "mosm/kg", "ml/day", "uIU/mL", "ug/dl", "mmol/24 Hrs", "milli/cu-mm",
            "mIU/ml", "UNIT", "MILL/CUMM", "PEI U/ml", "S/CO", "gm%", "mm/hr", "OD Units",
            "A/C.O", "co/s", "mEq/L", "pg/ml", "ng/dl", "mm", "Million", "Days", "ml/hr",
            "l/24 hrs", "Clear", "Negative <1.00, Positive >= 1.00", "ng/ml", "IU/ml", "U/ml",
            "ml", "Upto 30 min", "> 50 %", "mg/24 hr", "cells/cu mm", "mmol/l", "mEq/day",
            "mg/l", "U/gHb", "gm/l", "lakh/cu mm", "Present", "Absent", "Negative", "Positive",
            "mcg/mg creatinine", "ug/l", "RU/ml", "ng/L", "mg %", "Full Quantity", "ng/ml",
            "K/mcL", "U/L", "mg/L", "Lakhs/cumm", "Cells/cumm", "mIU/L", "mg/24 hr", "Min",
            "mg/day", "Test", "µg/dL", "µmol/L", "million cells/mcL", "ML", "Seconds", "mmol/L",
            "uml", "ml", "NA", "gm/dl", "gm/dl", "gm/dl", "$$$", "cells/mcL", "%", "mcL", "mg/dL",
            "mcg", "IU/mL", "IU/L", "pg", "mEq", "g/dL"
        ];

    const uniqueUnits = [...new Set(units)];
        // Map units to an array of objects
        const unitDocuments = uniqueUnits.map(unit => ({ unitName: unit }));

        // Insert into MongoDB
        const result = await Unit.insertMany(unitDocuments,);
        console.log(`Units added successfully: ${result.length}`);
    } catch (error) {
        
            console.error("Error adding units:", error.message);
        
    }
}
