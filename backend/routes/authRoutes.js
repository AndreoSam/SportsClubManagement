const express = require("express");

const router = express.Router();

const { sendOtp, verifyOtp } = require("../controllers/authController");

router.post("/send-email-otp", sendOtp);

router.post("/verify-email-otp", verifyOtp);

module.exports = router;
