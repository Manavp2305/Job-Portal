import express from "express";
import upload from "../middleware/upload.js";
import {
  submitApplication,
  getAllApplications,
  acceptRejectApplication,
} from "../controllers/applicationController.js";

const router = express.Router();
router.post("/", upload.single("resume"), submitApplication);
router.get("/", getAllApplications);
router.post("/acceptReject", acceptRejectApplication);

export default router;
