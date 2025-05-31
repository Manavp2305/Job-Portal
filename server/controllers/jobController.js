// controllers/jobController.js
import Job from "../models/Job.js";

const createJob = async (req, res) => {
  try {
    const { title, location, category, level, salary, description } = req.body;

    if (!title || !location || !category || !level || !salary || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const currentDate = new Date();

    const newJob = new Job({
      title,
      location,
      category,
      level,
      salary,
      description,
    });

    await newJob.save();

    res.status(201).json({ message: "Job added successfully", job: newJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { createJob };
