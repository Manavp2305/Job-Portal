import express from "express";
import { registerRecruiter, loginRecruiter } from "../controllers/recruiterController.js";

const router = express.Router();

router.post("/signup", registerRecruiter);
router.post("/login", loginRecruiter);

export default router;
