const sendEmail = require("../common/sendMail");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const sendVerificationEmail = async (email, verificationCode) => {
  const subject = "Registration Verification Code";
  const message = `Welcome to Deer 30! Your verification code is: ${verificationCode}. Please use this code to verify your account within 15 minutes.`;
  await sendEmail(email, subject, message);
};

const userSignUp = async (req, res) => {
  try {
    const { firstName,lastName, password, email, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "User already exists with the given email",
      });
    }

    // Validate inputs
    if (!firstName || !password || !email || !userType) {
      return res.status(403).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("hashedPassword", hashedPassword);

    // Generate verification code for verifcation of hte email
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    sendVerificationEmail(email, verificationCode);

    // Create and save the new user
    const newUser = new User({
      firstName,lastName,
      email,
      userType,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires,
    });
    await newUser.save();
    // Respond with success
    return res.status(200).json({
      success: true,
      message:
        "Signup successful! Please verify your email with the given OTP.",
    });
  } catch (error) {
    console.error("Error in userSignUp:", error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: "An error occurred during signup. Please try again later.",
    });
  }
};

const userVerify = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    console.log("codes", user.verificationCode, verificationCode);
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: "Verification successfull." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { password, email } = req.body;
    // Validate inputs
    if (!password || !email) {
      return res.status(403).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(403).json({
        success: false,
        message: "User does not exists with the given email, Please SignUp",
      });
    }
    const passwordmatched = await bcrypt.compare(
      password,
      existingUser.password
    );
    // Respond with success
    if (passwordmatched) {
      console.log("login successful");
      const token = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
          userType: existingUser.userType,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.status(200).json({
        success: true,
        message: "Login successfull!",
        token,
        data: {
          id: existingUser._id,
          email: existingUser.email,
          userType: existingUser.userType,
        },
      });
    } else {
      return res.status(403).json({
        success: true,
        message: "Please provide correct Details!",
      });
    }
  } catch (error) {
    console.error("Error in userSignUp:", error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }
    // console.log("into forget password");
    const newVerificationCode = Math.floor(
      1000 + Math.random() * 9000
    ).toString();
    const newVerificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

    user.verificationCode = newVerificationCode;
    user.verificationCodeExpires = newVerificationCodeExpires;

    await user.save();

    const subject = "Password Reset OTP";
    const message = `Your password reset OTP is: ${newVerificationCode}. Please use this OTP to reset your password. This OTP is valid for 15 minutes.`;

    await sendEmail(user.email, subject, message);

    return res
      .status(200)
      .json({ message: "OTP sent to your email for password reset" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const users = await User.findOne({ email});
    if (!users) return res.status(404).send({ message: "user not found" });
    if (users.verificationCode === otp) {
      return res.status(200).json({
        success: true,
        message: "OTP Verified, Please Reset Your Password",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Please Provide Valid OTP",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  userSignUp,
  userLogin,
  userVerify,
  forgetPassword,
  verifyOtp,
  changePassword,
};
