import express from "express";
import Question from "../models/Question.js";
import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", authenticate, async (req, res) => {
  const { title, description } = req.body;
  const newQuestion = new Question({ user: req.user.id, title, description });
  await newQuestion.save();
  res.json(newQuestion);
});
router.get("/", async (req, res) => {
  const questions = await Question.find().populate("user", "name").populate({
    path: "answers",
    populate: { path: "user", select: "name" },
  });
  res.json(questions);
});
router.delete("/:id", authenticate, async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ message: "Question not found" });

  if (question.user.toString() !== req.user.id)
    return res.status(403).json({ message: "Unauthorized" });

  await question.remove();
  res.json({ message: "Question Deleted" });
});

export default router;
