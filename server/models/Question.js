
import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  answer: { type: String, required: true },
  timestamp: { type: String, required: true }, // Store timestamp as a string (ISO format)
});

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  name: { type: String, required: true },
  timestamp: { type: String, required: true }, // Store timestamp as a string (ISO format)
  answers: [AnswerSchema], // Array of answers
});

const Question = mongoose.model("Question", QuestionSchema);

export default Question;
