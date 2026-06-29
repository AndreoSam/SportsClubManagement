const Otp = require("../models/Otp");
const Athlete = require("../models/Athlete");
const User = require("../models/User");
const sendOTPEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.sendOtp = async (req, res) => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✓ Set" : "✗ Missing");
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✓ Set" : "✗ Missing");

    const { email } = req.body;

    // Check if email already exists
    const existingAthlete = await Athlete.findOne({
      "personal.email": email,
    });

    if (existingAthlete) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete previous OTPs
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log("OTP Saved:", otp);

    // Send email
    const info = await sendOTPEmail(email, otp);

    console.log("Email sent:", info.response);

    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (err) {
    console.error("OTP ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({
      email,
      otp,
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({
        _id: record._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    record.verified = true;
    await record.save();

    return res.status(200).json({
      success: true,
      message: "Email Verified Successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
