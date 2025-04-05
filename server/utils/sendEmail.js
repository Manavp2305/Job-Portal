import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Generate a random OTP
 */
export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Get OTP expiration time (1 minute validity)
 */
export const getOtpExpirationTime = () => {
  return new Date(Date.now() + 60 * 1000);
};

/**
 * Send OTP Email to User
 */
export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Let's Connect To The JobConnect",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Use this OTP to verify your account in JobConnect</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="color: #ff6600; font-size: 30px;">${otp}</h1>
        <p>This OTP expires in <strong>1 minute</strong>. Do not share it with anyone.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ OTP Email Sent Successfully");
  } catch (error) {
    console.error("❌ Email Send Error:", error);
    throw new Error("Failed to send OTP email");
  }
};

/**
 * Send Job Application Confirmation Email
 */
export const sendJobApplicationEmail = async (toEmail, name, company, jobTitle) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "📩 Job Application Received - JobConnect",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: left;">
        <h2>Dear <strong>${name}</strong>,</h2>
        <p>Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${company}</strong>.</p>
        <p>We have received your application and our HR team will review it shortly.</p>
        <p>If your application is shortlisted, we will contact you for further steps.</p>
        <br/>
        <p>Best Regards,</p>
        <p><strong>${company} Hiring Team</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Job Application Email Sent Successfully");
  } catch (error) {
    console.error("❌ Error sending Job Application Email:", error);
    throw new Error("Failed to send job application email");
  }
};
