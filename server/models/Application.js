import mongoose from "mongoose";

// Define schema for an application
const ApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    jobId: { type: String, required: true },
    company: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    resume: { type: String, required: true },
    status: { type: String, default: "Pending" }, // Track the status
  },
  { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);
