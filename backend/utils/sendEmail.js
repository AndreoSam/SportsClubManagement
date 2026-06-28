const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  const info = await transporter.sendMail({
    from: `"Sports Club" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`,
  });

  return info;
};

module.exports = sendOTPEmail;
