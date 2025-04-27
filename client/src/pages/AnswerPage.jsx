import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // For anonymous user IDs
import moment from "moment";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion"; // For animations

const AnswerPage = () => {
  const { questionId } = useParams(); // Retrieve the questionId from the URL params
  const [questionData, setQuestionData] = useState(null);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  // Simulate fetching data from local storage or an API (e.g., based on questionId)
  useEffect(() => {
    const question = JSON.parse(localStorage.getItem(questionId)); // assuming stored question data is keyed by questionId
    if (question) {
      setQuestionData(question); // Set the fetched question data
      setAnswers(question.answers || []); // Set the answers for the question, defaulting to an empty array
    } else {
      // If no question is found in local storage, you can handle it by redirecting to a 404 page or something else.
      navigate("/"); // Redirect to the home page if the question doesn't exist
    }
  }, [questionId, navigate]); // Run this effect whenever the questionId changes

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) return; // Don't allow empty answers

    const newAnswer = {
      id: uuidv4(),
      answer,
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    setAnswers([newAnswer, ...answers]); // Add the new answer to the answers list
    setAnswer(""); // Reset the answer input field
    // Optionally, you could save the answers back to local storage if required
    const updatedQuestion = { ...questionData, answers: [newAnswer, ...answers] };
    localStorage.setItem(questionId, JSON.stringify(updatedQuestion)); // Store updated question data
  };

  return questionData ? (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col py-10 container px-4 mx-auto">
        <motion.div
          className="bg-white text-black rounded-lg w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Question Header */}
          <div className="flex justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-medium">{questionData.question}</h1>
              <span className="text-sm text-gray-600 mt-2">
                Posted {moment(questionData.timestamp).fromNow()}
              </span>
            </div>
          </div>

          {/* Answers Section */}
          <div className="mt-10">
            <h2 className="font-semibold text-2xl mb-4">Answers</h2>
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {answers.length > 0 ? (
                answers.map((ans) => (
                  <motion.div
                    key={ans.id}
                    className="bg-gray-100 p-4 rounded-lg shadow-lg"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-700">{ans.answer}</p>
                      <span className="text-sm text-gray-500">{ans.timestamp}</span>
                    </div>
                    <p className="mt-2 text-gray-600">Posted by Anonymous</p>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  className="text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  No answers yet. Be the first to answer!
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Answer Form */}
          <motion.form
            onSubmit={handleAnswerSubmit}
            className="bg-gray-100 p-6 rounded-lg shadow-lg mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-4">Post Your Answer</h3>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-3 border rounded-lg"
              rows="4"
              placeholder="Write your answer..."
            ></textarea>
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Submit Answer
            </button>
          </motion.form>
        </motion.div>
      </div>
      <Footer />
    </>
  ) : (
    <div className="flex justify-center items-center min-h-screen">Loading...</div>
  );
};

export default AnswerPage;
