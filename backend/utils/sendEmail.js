const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendOTPEmail = async (email, otp) => {
  console.log("Verifying SMTP...");

  await transporter.verify();

  console.log("SMTP Verified");

  const info = await transporter.sendMail({
    from: `"Sports Club" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`,
  });

  console.log("Mail Response:", info.response);

  return info;
};

module.exports = sendOTPEmail;
