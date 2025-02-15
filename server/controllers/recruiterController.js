import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Recruiter from "../models/recruiterModel.js";

const createToken = (id) => {
    return jwt.sign({ id, role: "recruiter" }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
export const recruiterRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const recruiterExists = await Recruiter.findOne({ email });
        if (recruiterExists) return res.status(400).json({ message: "Recruiter already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newRecruiter = await Recruiter.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = createToken(newRecruiter._id);

        res.status(201).json({ success: true, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Recruiter Login
export const recruiterLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const recruiter = await Recruiter.findOne({ email });
        if (!recruiter) return res.status(400).json({ message: "Recruiter not found" });

        const isMatch = await bcrypt.compare(password, recruiter.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = createToken(recruiter._id);

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
