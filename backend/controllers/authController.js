const Otp = require("../models/Otp");
const Athlete = require("../models/Athlete");
const sendOTPEmail = require("../utils/sendEmail");

exports.sendOtp = async (req, res) => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✓ Set" : "✗ Missing");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✓ Set" : "✗ Missing");
  try {
    console.log("1. Request received");

    const { email } = req.body;
    console.log("2. Email:", email);

    const existingAthlete = await Athlete.findOne({
      "personal.email": email,
    });
    console.log("3. Athlete checked");

    if (existingAthlete) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("4. OTP generated");

    await Otp.deleteMany({ email });
    console.log("5. Old OTP deleted");

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    console.log("6. OTP saved");

    console.log("7. Before sendOTPEmail");

    const { info, logs } = await sendOTPEmail(email, otp);

    console.log("8. After sendOTPEmail");
    console.log(info);

    return res.status(200).json({
      success: true,
      message: "OTP Sent",
      logs,
    });
  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
      logs: [err.message],
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
