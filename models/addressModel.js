const { default: mongoose } = require("mongoose");

const addressSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    name:{
        type :String
    },
    addressLine: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    pinCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
    },
    phoneNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v); // Validates 10-digit phone number if provided
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
  }, { timestamps: true });
  

  module.exports=mongoose.model("Address",addressSchema)