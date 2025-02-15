import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const RecruiterLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = "Recruiter Login";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/recruiter/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Login Successful!");
      navigate("/dashboard");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Recruiter Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="/recruiter-register">Register</a></p>
      </div>
    </div>
  );
};

export default RecruiterLogin;
