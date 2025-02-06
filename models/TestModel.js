const mongoose = require("mongoose");
const testSchema = new mongoose.Schema({
    testName: { type: String, required: true, unique: true },
    parameters:[{type:mongoose.Schema.Types.ObjectId,ref:"Parameter"}],
    description: { type: String },
    price:{type:Number,required: true},
    footNote:{type:String},
  });
  
  module.exports = mongoose.model("Test", testSchema);
  