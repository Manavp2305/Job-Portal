// routes/questionRoutes.js
import express from "express";
import {
  getAllQuestions,
  createQuestion,
  answerQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getAllQuestions);
router.post("/", createQuestion);
router.post("/:questionId/answer", answerQuestion);

export default router;
