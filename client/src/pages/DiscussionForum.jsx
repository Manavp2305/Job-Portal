import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Navbar from "../components/Navbar";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";

const DiscussionForum = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [discussion, setDiscussion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch questions on component mount
  const { jobId } = useParams();
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("/api/questions");
        console.log("Fetched questions:", response.data);
    
        if (Array.isArray(response.data)) {
          const filteredQuestions = response.data.filter(
            (q) => q.jobId === jobId
          );
          setDiscussion(filteredQuestions);
        } else {
          setError("Unexpected data format received.");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Error fetching questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    

    fetchQuestions();
  }, []);

  // Submit a new question
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      alert("Question cannot be empty!");
      return;
    }

    try {
      const newQuestion = {
        question,
        name: "Anonymous",
        timestamp: new Date().toISOString(),
        jobId: jobId, // attach jobId
      };
      

      const response = await axios.post("/api/questions", newQuestion);
      if (response.data) {
        setDiscussion([response.data, ...discussion]);
        setQuestion(""); // Clear input after submit
      }
    } catch (error) {
      alert("Error posting the question.");
    }
  };

  // Submit an answer
  const handleSubmitAnswer = async (e, questionId) => {
    e.preventDefault();
    if (!answer.trim()) {
      alert("Answer cannot be empty!");
      return;
    }

    try {
      const response = await axios.post(`/api/questions/${questionId}/answer`, {
        answer,
        timestamp: new Date().toISOString(), // Ensure timestamp is in ISO format
      });

      setDiscussion(
        discussion.map((item) =>
          item._id === questionId
            ? { ...item, answers: response.data.answers }
            : item
        )
      );
      setAnswer(""); // Clear input after submit
    } catch (error) {
      alert("Error posting the answer.");
    }
  };

  if (loading) {
    return <div>Loading discussions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center flex-grow py-12">
        <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-xl">
          <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">Discussion Forum</h1>

          <div className="space-y-8">
            {discussion.map((item) => (
              <div key={item._id} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FaUserCircle className="text-gray-600 text-2xl" />
                    <p className="font-semibold text-gray-900">{item.name}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {`Posted on ${moment(item.timestamp).format("MMM Do, YYYY, h:mm A")}`}
                  </p>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">{item.question}</h2>

                {item.answers.length > 0 && (
                  <div className="space-y-4 mt-6">
                    {item.answers.map((ans, index) => (
                      <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaUserCircle className="text-gray-600 text-xl" />
                          <p className="font-semibold text-gray-800">Anonymous</p>
                        </div>
                        <p className="text-gray-700">{ans.answer}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {`Answered on ${moment(ans.timestamp).format("MMM Do, YYYY, h:mm A")}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={(e) => handleSubmitAnswer(e, item._id)} className="mt-6">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows="4"
                    className="w-full p-4 border-2 border-gray-300 rounded-lg"
                    placeholder="Write your answer..."
                  />
                  <button
                    type="submit"
                    className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg"
                  >
                    Submit Answer
                  </button>
                </form>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmitQuestion} className="mt-12 p-8 bg-gray-50 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Post a Question</h2>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows="6"
              className="w-full p-4 border-2 border-gray-300 rounded-lg"
              placeholder="Ask a question..."
            />
            <button
              type="submit"
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Submit Question
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DiscussionForum;
