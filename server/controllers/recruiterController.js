import Recruiter from "../models/recruiterModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerRecruiter = async (req, res) => {
  try {
    const { companyName, email, password } = req.body;
    const recruiterExists = await Recruiter.findOne({ email });

    if (recruiterExists) return res.status(400).json({ message: "Recruiter already exists" });

    const recruiter = await Recruiter.create({ companyName, email, password });

    res.status(201).json({ message: "Recruiter registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;
    const recruiter = await Recruiter.findOne({ email });

    if (!recruiter) return res.status(400).json({ message: "Recruiter not found" });

    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: recruiter._id, role: "recruiter" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful", token, role: "recruiter" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
