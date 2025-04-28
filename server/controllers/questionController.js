// controllers/questionController.js
import Question from "../models/Question.js";

// Get all questions with answers
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions); // Return the questions as a JSON array
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
};

// Create a new question
export const createQuestion = async (req, res) => {
  const { question, name } = req.body;
  const timestamp = new Date().toISOString(); // Use ISO format for timestamp

  const newQuestion = new Question({
    question,
    name,
    timestamp,
    answers: [], // Initialize with an empty array
  });

  try {
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion); // Return the saved question
  } catch (error) {
    res.status(500).json({ message: "Error creating question" });
  }
};

// Answer a question
export const answerQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { answer } = req.body;
  const timestamp = new Date().toISOString(); // Use ISO format for timestamp

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.answers.push({ answer, timestamp });
    await question.save();

    res.status(200).json(question); // Return updated question with answers
  } catch (error) {
    res.status(500).json({ message: "Error answering question" });
  }
};

export const getQuestionById = async (req, res) => {
  const { questionId } = req.params;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};