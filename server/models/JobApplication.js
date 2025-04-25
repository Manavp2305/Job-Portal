import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  resume: String,
  companyName: String,
  jobRole: String,
  status: { type: String, default: "Pending" },
});

const JobApplication = mongoose.model("JobApplication", JobApplicationSchema);
export default JobApplication;
