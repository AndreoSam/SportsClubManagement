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

const sendRegistrationEmail = async (email, name, role) => {
  const roleLabel = role === "Athlete" ? "Athlete" : "Coach";
  const info = await transporter.sendMail({
    from: `"Sports Club Management" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Registration Successful - Application Under Review",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-top: 0;">Welcome to Sports Club Management!</h2>
          
          <p style="color: #666; font-size: 16px;">Hi <strong>${name}</strong>,</p>
          
          <p style="color: #666; font-size: 16px;">
            Your registration as a <strong>${roleLabel}</strong> has been successfully received. 
            We have received all your documents and information.
          </p>
          
          <div style="background-color: #e8f4f8; padding: 15px; border-left: 4px solid #0084ff; margin: 20px 0;">
            <p style="color: #333; margin: 0;">
              <strong>What's Next?</strong><br/>
              Our admin team will review your application and documents. You will receive an email notification once your application has been approved or if any clarifications are needed.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            If you have any questions, please contact our support team.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Sports Club Management<br/>
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  });
  return info;
};

const sendApprovalEmail = async (email, name, role) => {
  const roleLabel = role === "Athlete" ? "Athlete" : "Coach";
  const info = await transporter.sendMail({
    from: `"Sports Club Management" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Application Approved - Welcome!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
          <h2 style="color: #27ae60; margin-top: 0;">Congratulations! Your Application is Approved</h2>
          
          <p style="color: #666; font-size: 16px;">Hi <strong>${name}</strong>,</p>
          
          <p style="color: #666; font-size: 16px;">
            Great news! Your application as a <strong>${roleLabel}</strong> has been approved by our admin team.
          </p>
          
          <div style="background-color: #d5f4e6; padding: 15px; border-left: 4px solid #27ae60; margin: 20px 0;">
            <p style="color: #333; margin: 0;">
              <strong>✓ You are now approved!</strong><br/>
              You can now log in to your account and start using the platform.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            <strong>Next Steps:</strong>
            <ul style="color: #666;">
              <li>Log in to your account using your registered email and password</li>
              <li>Complete any additional profile setup if required</li>
              <li>Start participating in the sports club activities</li>
            </ul>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            If you have any questions, please don't hesitate to contact our support team.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Sports Club Management<br/>
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  });
  return info;
};

const sendRejectionEmail = async (email, name, role, rejectionReason) => {
  const roleLabel = role === "Athlete" ? "Athlete" : "Coach";
  const info = await transporter.sendMail({
    from: `"Sports Club Management" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Application Status Update",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
          <h2 style="color: #e74c3c; margin-top: 0;">Application Status Update</h2>
          
          <p style="color: #666; font-size: 16px;">Hi <strong>${name}</strong>,</p>
          
          <p style="color: #666; font-size: 16px;">
            Thank you for your interest in joining our sports club as a <strong>${roleLabel}</strong>. 
            After careful review of your application, we regret to inform you that your application has not been approved at this time.
          </p>
          
          <div style="background-color: #fadbd8; padding: 15px; border-left: 4px solid #e74c3c; margin: 20px 0;">
            <p style="color: #333; margin: 0;">
              <strong>Reason for Rejection:</strong><br/>
              ${rejectionReason}
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            <strong>What can you do?</strong>
            <ul style="color: #666;">
              <li>Review the feedback provided above</li>
              <li>You may reapply after addressing the mentioned concerns</li>
              <li>Contact our support team if you need clarification</li>
            </ul>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            We appreciate your interest and wish you the best. Feel free to reach out if you have any questions.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Sports Club Management<br/>
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  });
  return info;
};

module.exports = {
  sendRegistrationEmail,
  sendApprovalEmail,
  sendRejectionEmail,
};
