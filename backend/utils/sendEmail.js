const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (email, otp) => {
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your OTP",
    html: `
      <h2>Sports Club Management</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  });

  console.log(result);

  return result;
};

module.exports = sendOTPEmail;
