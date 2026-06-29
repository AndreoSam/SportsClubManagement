const express = require("express");

const router = express.Router();

const { sendOtp, verifyOtp, login } = require("../controllers/authController");

router.post("/send-email-otp", sendOtp);

router.post("/verify-email-otp", verifyOtp);

router.post("/login", login);

module.exports = router;
