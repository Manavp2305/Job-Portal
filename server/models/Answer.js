import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Answer", AnswerSchema);
