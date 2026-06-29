const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  pool: true,
  maxConnections: 5,
  maxMessages: 100,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  const info = await transporter.sendMail({
    from: `"Sports Club Management" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Sports Club Management</h2>

        <p>Your OTP for email verification is:</p>

        <h1 style="letter-spacing:5px;">${otp}</h1>

        <p>This OTP is valid for <b>5 minutes</b>.</p>

        <p>If you did not request this OTP, please ignore this email.</p>
      </div>
    `,
  });

  return info;
};

module.exports = sendOTPEmail;
