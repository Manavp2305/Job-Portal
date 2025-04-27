import express from "express";
import {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  protect,
  logoutUser,
} from "../controllers/userController.js";
import { body } from "express-validator";

const router = express.Router();
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  registerUser
);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", loginUser);
router.post("/logout", logoutUser); 
router.get("/profile", protect, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

export default router;
