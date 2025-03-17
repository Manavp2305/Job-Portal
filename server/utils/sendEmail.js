import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
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
export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
export const getOtpExpirationTime = () => {
  return new Date(Date.now() + 60 * 1000);
};
export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Let's Connect To The JobConnect",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Use this OTP for verify your account in JobConnect</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="color: #ff6600; font-size: 30px;">${otp}</h1>
        <p>This OTP expires in <strong>1 minute</strong>. Do not share it with anyone.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP Email Sent Successfully");
  } catch (error) {
    console.error("Email Send Error:", error);
    throw new Error("Failed to send OTP email");
  }
};
