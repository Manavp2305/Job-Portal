import React, { useState, useRef, useEffect } from "react";
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
  const [isOTPVerification, setIsOTPVerification] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // To track login status

  const otpRefs = useRef([]);

  const handleOpen = (isRecruiterLogin, signUp = false) => {
    setShowPopup(true);
    setIsClosing(false);
    setIsRecruiter(isRecruiterLogin);
    setIsSignUp(signUp);
    setIsOTPVerification(false);
    setShowDropdown(false);
    setError("");
    setOtp(["", "", "", ""]);
    setOtpError("");
    setFormData({ fullName: "", companyName: "", email: "", password: "" });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsRecruiter(false);
      setIsSignUp(false);
      setIsOTPVerification(false);
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

      const payload = isSignUp
        ? isRecruiter
          ? { companyName: formData.companyName, email: formData.email, password: formData.password }
          : { fullName: formData.fullName, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || (isSignUp ? "Sign Up failed" : "Login failed"));

      if (!isSignUp) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", isRecruiter ? "recruiter" : "user");
        setIsLoggedIn(true); // Mark the user as logged in
        handleClose();
      } else {
        setIsOTPVerification(true);
        setTimeout(() => otpRefs.current[0]?.focus(), 200);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("").trim();

    if (otp.length !== 4 || otp.some(d => d === "" || isNaN(d)) || otpCode.length !== 4) {
      setOtpError("OTP must be 4 valid digits");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpCode }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "OTP verification failed");

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", "user");
      setIsLoggedIn(true); // Mark the user as logged in
      alert("OTP Verified! Sign Up Complete.");
      handleClose();
    } catch (err) {
      console.error("❌ OTP Verify Error:", err.message);
      setOtpError(err.message);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false); // Mark the user as logged out
    alert("Logged out successfully");
    navigate("/"); // Redirect to the homepage after logout
  };

  return (
    <div className="shadow py-4 bg-white">
      <div className="container mx-auto flex justify-between items-center px-8">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo_image} alt="Logo" className="h-14" />
        </div>

        <div className="relative">
          <FaUser className="ml-10 cursor-pointer text-3xl text-gray-700" onClick={() => setShowDropdown(!showDropdown)} />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
              {!isLoggedIn ? (
                <>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleOpen(false)}>
                    User Login
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleOpen(true)}>
                    Recruiter Login
                  </button>
                </>
              ) : (
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md z-40">
          <div className={`relative w-[780px] bg-white shadow-2xl rounded-xl p-6 transition-all duration-500 ease-in-out transform ${isClosing ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
            <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl" onClick={handleClose}>
              <IoClose />
            </button>

            {isOTPVerification ? (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg shadow-inner flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Verification Code</h3>
                  <p className="text-sm text-gray-500 mb-6 text-center">
                    We’ve sent a code to your email. If you didn’t receive it, you can request it again.
                  </p>
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
                    Resend
                  </button>
                </div>

                <div className="bg-green-50 p-6 rounded-lg shadow-inner flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-green-700 mb-4 text-center">Enter OTP</h3>
                  <div className="flex justify-center space-x-3 mb-4">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpRefs.current[idx] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-12 text-2xl text-center border-2 border-green-400 rounded-md outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ))}
                  </div>
                  {otpError && <p className="text-center text-red-500 text-sm">{otpError}</p>}
                  <button
                    className="mt-2 mx-auto block bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                    onClick={handleVerifyOTP}
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-semibold text-center text-gray-700">
                  {isSignUp
                    ? isRecruiter
                      ? "Recruiter Sign Up"
                      : "User Sign Up"
                    : isRecruiter
                    ? "Recruiter Login"
                    : "User Login"}
                </h2>

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

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="flex justify-center space-x-4">
                  <button
                    type="submit"
                    className="w-28 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {isSignUp ? "Sign Up" : "Login"}
                  </button>

                  <button
                    type="button"
                    className="w-28 py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    onClick={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp ? "Have an account?" : "Need an account?"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
