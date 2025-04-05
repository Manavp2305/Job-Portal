import express from "express";
import upload from "../middleware/upload.js";
import { submitApplication } from "../controllers/applicationController.js";
import Application from "../models/Application.js"; // ✅ FIXED - Import Application Model

const router = express.Router();

// ✅ Submit Job Application (with File Upload)
router.post("/", upload.single("resume"), submitApplication);

// ✅ Get All Job Applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ date: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
