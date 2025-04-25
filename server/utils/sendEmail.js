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
      <div style="background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
  <table align="center" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px; width: 100%; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden;">
    <tr>
      <td style="padding: 40px 30px; text-align: center;">
        <img 
  src="https://jobsconnect.ae/wp-content/uploads/2024/06/jobsconnect-horizontal-logo.png" 
  alt="JobConnect Logo" 
  style="width: 100%; max-width: 300px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" 
/>

        <h2 style="font-size: 24px; color: #333333; margin: 0;">Verify Your Email for JobConnect</h2>
        <p style="color: #666666; font-size: 16px; margin: 20px 0 30px;">
          Use the OTP below to complete your email verification. This code is valid for <strong>1 minute</strong>.
        </p>
        <div style="background-color: #fef3e8; display: inline-block; padding: 15px 30px; border-radius: 8px; margin-bottom: 30px;">
          <h1 style="color: #ff6600; font-size: 36px; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #999999; font-size: 14px; margin-top: 10px;">Do not share this OTP with anyone.</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #fafafa; padding: 20px 30px; text-align: center; color: #999999; font-size: 12px;">
        &copy; 2025 JobConnect. All rights reserved.<br/>
        You're receiving this email because you recently registered with JobConnect.
      </td>
    </tr>
  </table>
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
export const sendJobApplicationEmail = async (
  toEmail,
  name,
  company,
  jobTitle
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "📩 Job Application Received - JobConnect",
    html: `
      <div style="background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
  <table align="center" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px; width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
    <tr>
      <td style="padding: 30px 40px;">
        <img src="https://jobconnect.com.au/wp-content/uploads/2023/10/1-Job-Connect-logo-for-use-on-black.jpg" alt="JobConnect Logo" style="width: 100%; max-width: 200px; height: auto; display: block; margin: 0 auto 30px auto;" />

        <h2 style="font-size: 22px; color: #333;">Dear <strong>${name}</strong>,</h2>

        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${company}</strong>.
        </p>

        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          We have received your application and our HR team will review it shortly.
        </p>

        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          If your application is shortlisted, we will contact you for further steps.
        </p>

        <p style="font-size: 16px; color: #555; margin-top: 30px; line-height: 1.6;">Best Regards,</p>
        <p style="font-size: 16px; color: #333; font-weight: bold; margin-top: 5px;">${company} Hiring Team</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #fafafa; padding: 20px 40px; text-align: center; color: #999999; font-size: 12px;">
        &copy; 2025 ${company}. All rights reserved.<br/>
        You are receiving this email because you applied for a job through JobConnect.
      </td>
    </tr>
  </table>
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

/**
 * Send Shortlisted Email
 */
export const sendAcceptanceEmail = async (to, name, company, role) => {
  const mailOptions = {
    from: `"${company} HR" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Job Application Accepted",
    html: `
      <div style="background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
  <table align="center" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px; width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
    <tr>
      <td style="padding: 30px 40px;">
        <img src="https://jobconnect.com.au/wp-content/uploads/2023/10/1-Job-Connect-logo-for-use-on-black.jpg" alt="JobConnect Logo" style="width: 100%; max-width: 200px; height: auto; display: block; margin: 0 auto 30px auto;" />

        <p style="font-size: 16px; color: #333; line-height: 1.6;">Dear <strong>${name}</strong>,</p>

        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          We are pleased to inform you that your application for the <strong>${role}</strong> position at <strong>${company}</strong> has been accepted.
        </p>

        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Our team will be in touch shortly with the next steps and additional details.
        </p>

        <p style="font-size: 16px; color: #555; margin-top: 30px; line-height: 1.6;">
          Best regards,<br/>
          <strong>${company} HR Team</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #fafafa; padding: 20px 40px; text-align: center; color: #999999; font-size: 12px;">
        &copy; 2025 ${company}. All rights reserved.<br/>
        You’re receiving this email because you applied for a role through JobConnect.
      </td>
    </tr>
  </table>
</div>

    `,
  };
  await transporter.sendMail(mailOptions);
};

export const sendRejectionEmail = async (to, name, company, role) => {
  const mailOptions = {
    from: `"${company} HR" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Job Application Rejected",
    html: `
      <div style="background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
  <table align="center" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px; width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
    <tr>
      <td style="padding: 30px 40px;">
        <img src="https://jobconnect.com.au/wp-content/uploads/2023/10/1-Job-Connect-logo-for-use-on-black.jpg" alt="JobConnect Logo" style="width: 100%; max-width: 200px; height: auto; display: block; margin: 0 auto 30px auto;" />

        <p style="font-size: 16px; color: #333; line-height: 1.6;">Dear <strong>${name}</strong>,</p>

        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Thank you for applying for the <strong>${role}</strong> position at <strong>${company}</strong>.
        </p>

        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          We regret to inform you that your application has not been selected for this role.
        </p>

        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          We truly appreciate the time and effort you took to apply and wish you the very best in your future endeavors.
        </p>

        <p style="font-size: 16px; color: #555; margin-top: 30px; line-height: 1.6;">
          Sincerely,<br/>
          <strong>${company} HR Team</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #fafafa; padding: 20px 40px; text-align: center; color: #999999; font-size: 12px;">
        &copy; 2025 ${company}. All rights reserved.<br/>
        You're receiving this email as a part of the job application process.
      </td>
    </tr>
  </table>
</div>

    `,
  };
  await transporter.sendMail(mailOptions);
};
