import Application from "../models/Application.js";
import {
  sendJobApplicationEmail,
  sendAcceptanceEmail,
  sendRejectionEmail,
} from "../utils/sendemail.js";

// Handle new job application submission
export const submitApplication = async (req, res) => {
  try {
    const { name, email, jobId, company, title, location } = req.body;

    // Validate input fields
    if (!name || !email || !jobId || !company || !title || !location) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create new application
    const newApplication = new Application({
      name,
      email,
      jobId,
      company,
      title,
      location,
      resume: req.file?.path || "",
      status: "Pending",
    });

    // Save application to database
    await newApplication.save();
    // Send job application email notification
    await sendJobApplicationEmail(email, name, company, title);

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("❌ Application Submission Error:", error);
    res.status(500).json({ message: "Failed to submit application" });
  }
};

// Get all applications from the database
export const getAllApplications = async (req, res) => {
  try {
    // Fetch applications sorted by creation date (most recent first)
    const applications = await Application.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// Accept or Reject an application and update the status
export const acceptRejectApplication = async (req, res) => {
  try {
    const {
      applicationId,
      action,
      applicantEmail,
      applicantName,
      jobTitle,
      companyName,
    } = req.body;

    // Validate input
    if (!applicationId || !action) {
      return res.status(400).json({ message: "Missing applicationId or action" });
    }

    // Find the application by ID
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update application status
    application.status = action === "accept" ? "Accepted" : "Rejected";
    await application.save();

    // Send email notification based on action (Accept or Reject)
    if (action === "accept") {
      await sendAcceptanceEmail(applicantEmail, applicantName, companyName, jobTitle);
    } else {
      await sendRejectionEmail(applicantEmail, applicantName, companyName, jobTitle);
    }

    res.status(200).json({ message: `Application ${action}ed successfully` });
  } catch (error) {
    console.error("Accept/Reject Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
