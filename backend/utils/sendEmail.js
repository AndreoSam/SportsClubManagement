const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  // 1. generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // 2. create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // 3. send mail (THIS is your code)
    const info = await transporter.sendMail({
      from: `"Sports Club" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Test OTP",
      text: `OTP is ${otp}`,
    });

    // 4. debug logs (THIS is where your logs go)
    console.log("ACCEPTED:", info.accepted);
    console.log("REJECTED:", info.rejected);
    console.log("RESPONSE:", info.response);

    res.json({
      success: true,
      message: "OTP sent",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Email failed" });
  }
});

module.exports = router;
