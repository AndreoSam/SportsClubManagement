const Otp = require("../models/Otp");
const Athlete = require("../models/Athlete");
const sendOTPEmail = require("../utils/sendEmail");

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Checking email:", email);

    // 1. Check existing athlete
    const existingAthlete = await Athlete.findOne({
      "personal.email": email,
    });

    if (existingAthlete) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Clear old OTPs
    await Otp.deleteMany({ email });

    // 4. Save OTP in DB FIRST
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // 5. ⚡ RESPOND IMMEDIATELY (IMPORTANT FIX)
    res.json({
      success: true,
      message: "OTP Sent",
    });

    // 6. 📩 Send email in background (NON-BLOCKING)
    sendOTPEmail(email, otp).catch((emailErr) => {
      console.error("Email sending failed:", emailErr.message);
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
