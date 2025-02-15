import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import logo_image from "../assets/logo_image.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Navbar = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", companyName: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleOpen = (isRecruiterLogin, signUp = false) => {
    setShowPopup(true);
    setIsClosing(false);
    setIsRecruiter(isRecruiterLogin);
    setIsSignUp(signUp);
    setShowDropdown(false);
    setError("");
    setFormData({ fullName: "", companyName: "", email: "", password: "" });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsRecruiter(false);
      setIsSignUp(false);
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isSignUp
        ? isRecruiter
          ? "/api/recruiter/signup"
          : "/api/user/signup"
        : isRecruiter
        ? "/api/recruiter/login"
        : "/api/user/login";

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || (isSignUp ? "Sign Up failed" : "Login failed"));

      if (!isSignUp) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", isRecruiter ? "recruiter" : "user");
        handleClose();
        navigate("/dashboard");
      } else {
        alert("Sign Up Successful! Please log in.");
        setIsSignUp(false);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="shadow py-4 bg-white">
      <div className="container mx-auto flex justify-between items-center px-8">
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo_image} alt="Logo" className="h-14" />
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <FaUser className="ml-10 cursor-pointer text-3xl text-gray-700" onClick={() => setShowDropdown(!showDropdown)} />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleOpen(false)}>
                User Login
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleOpen(true)}>
                Recruiter Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Login/Sign Up Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md z-40">
          <div
            className={`relative w-[380px] bg-white shadow-2xl rounded-xl p-6 transition-all duration-500 ease-in-out transform ${
              isClosing ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl" onClick={handleClose}>
              <IoClose />
            </button>

            <h2 className="text-xl font-semibold text-center text-gray-700">
              {isSignUp ? (isRecruiter ? "Recruiter Sign Up" : "User Sign Up") : isRecruiter ? "Recruiter Login" : "User Login"}
            </h2>

            <div className="flex justify-center my-5">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <FaUser className="text-3xl text-gray-600" />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                  <FaUser className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder={isRecruiter ? "Company Name" : "Full Name"}
                    value={isRecruiter ? formData.companyName : formData.fullName}
                    onChange={(e) =>
                      isRecruiter
                        ? setFormData({ ...formData, companyName: e.target.value })
                        : setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="bg-transparent outline-none w-full text-gray-700"
                    required
                  />
                </div>
              )}

              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-transparent outline-none w-full text-gray-700"
                  required
                />
              </div>

              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <FaLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-transparent outline-none w-full text-gray-700"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">
                {isSignUp ? "Sign Up" : "Login"}
              </button>

              <p className="text-center text-sm text-gray-600 mt-3">
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => setIsSignUp(false)}>
                      Log in
                    </span>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => setIsSignUp(true)}>
                      Sign up
                    </span>
                  </>
                )}
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
