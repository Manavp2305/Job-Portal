import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { validationResult } from "express-validator";
import { sendOtpEmail } from "../utils/sendEmail.js";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env file");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User and Send OTP
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = moment().add(5, "minutes").toDate();

    if (user) {
      user.otp = otp;
      user.otpExpires = otpExpires;
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        email,
        password: hashedPassword,
        otp,
        otpExpires,
        isVerified: false,
      });
    }

    await user.save();
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email. Please verify." });
  } catch (error) {
    console.error(" Register Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify OTP for User
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log("🔍 Incoming email:", email, "OTP:", otp); // Debug

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    console.log("📦 Stored OTP:", user.otp); // Debug

    if (!user.otp || user.otp.toString() !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (moment().isAfter(user.otpExpires)) {
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = generateToken(user._id);
    res.json({ message: "Email verified successfully.", token });
  } catch (error) {
    console.error("❌ Verify OTP Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Resend OTP if needed
export const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = moment().add(5, "minutes").toDate();

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOtpEmail(email, otp);
    res.json({ message: "New OTP sent to email." });
  } catch (error) {
    console.error(" Resend OTP Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// User Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email before logging in." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    res.json({ message: "Login successful.", token });
  } catch (error) {
    console.error(" Login Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Protect route with JWT token
export const protect = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.error(" Token Error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Logout User (JWT is stateless, so no actual action needed here)
export const logoutUser = async (req, res) => {
  try {
    // Since JWTs are stateless, the backend doesn't need to do much.
    // However, if you're maintaining a blacklist or session store, you can invalidate the token here.

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
