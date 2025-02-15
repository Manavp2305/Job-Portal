import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

const Recruiter = mongoose.model("Recruiter", recruiterSchema);
export default Recruiter;
