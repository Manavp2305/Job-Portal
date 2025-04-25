// routes/jobRoutes.js
import express from "express";
import { createJob } from "../controllers/jobController.js";

const router = express.Router();

// POST route to create a job
router.post("/", createJob);

export default router;
