import multer from "multer";
import path from "path";
import Application from "../models/Application.js";

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  }
});

// ✅ Multer File Filter (Only PDFs)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

// ✅ Multer Upload Middleware (5MB limit)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single("resume"); // Ensure "resume" matches frontend field name

// ✅ Submit Job Application
export const submitApplication = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload error", error: err.message });
    }

    try {
      console.log("Request Body:", req.body);
      console.log("Uploaded File:", req.file);

      // ✅ Validate Required Fields
      const { name, email, jobId, company, title, location } = req.body;

      if (!name || !email || !jobId || !company || !title || !location) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Resume file is required" });
      }

      // ✅ Save Application to Database
      const newApplication = new Application({
        name,
        email,
        jobId,
        company,
        title,
        location,
        resume: req.file.path, // Save uploaded file path
      });

      await newApplication.save();
      res.status(201).json({ message: "Application submitted successfully", application: newApplication });

    } catch (error) {
      console.error("Error in submitApplication:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};
