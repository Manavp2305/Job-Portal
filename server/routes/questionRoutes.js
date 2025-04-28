// routes/questionRoutes.js
import express from "express";
import {
  getAllQuestions,
  createQuestion,
  answerQuestion,
  getQuestionById // New handler for fetching a specific question by ID
} from "../controllers/questionController.js";

const router = express.Router();

// Route for getting all questions
router.get("/", getAllQuestions);

// Route for creating a question
router.post("/", createQuestion);

// Route for answering a specific question
router.post("/:questionId/answer", answerQuestion);

// New route to get a single question by its ID
router.get("/:questionId", getQuestionById);

export default router;
