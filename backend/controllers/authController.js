const Otp = require("../models/Otp");
const Athlete = require("../models/Athlete");
const sendOTPEmail = require("../utils/sendEmail");

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
