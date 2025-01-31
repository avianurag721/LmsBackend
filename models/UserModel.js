const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },

    gender: {
      type: String,
    },
    dob: {
      type: String,
    },
    password: {
      type: String,
      required: function () {
        return this.isVerified;
      },
    },
    verificationCode: {
      type: String,
    },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    userType: {
      type: String,

      enum: ["customer", "vendor", "admin"],
      required: true,
    },
    verificationCodeExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
