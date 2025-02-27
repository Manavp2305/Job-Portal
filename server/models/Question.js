import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
});

export default mongoose.model("Question", QuestionSchema);
