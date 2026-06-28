const Otp = require("../models/Otp");
const Athlete = require("../models/Athlete");
const sendOTPEmail = require("../utils/sendEmail");

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Checking email:", email);

    // Check if athlete already exists
    const existingAthlete = await Athlete.findOne({
      "personal.email": email,
    });

    console.log("Existing Athlete:", existingAthlete);

    if (existingAthlete) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove previous OTP
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Send email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailErr) {
      console.error("Email sending error:", emailErr);
      await Otp.deleteOne({ email, otp });
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      });
    }

    return res.json({
      success: true,
      message: "OTP Sent",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });

      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    record.verified = true;
    await record.save();

    return res.json({
      success: true,
      message: "Email Verified",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
