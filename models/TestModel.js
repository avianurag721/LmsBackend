const mongoose = require("mongoose");
const testSchema = new mongoose.Schema({
    testName: { type: String, required: true, unique: true },
    parameters:[{type:mongoose.Schema.Types.ObjectId,ref:""}],
    description: { type: String },
    price:{type:Number},
    footNote:{type:String},
  });
  
  module.exports = mongoose.model("Test", testSchema);
  