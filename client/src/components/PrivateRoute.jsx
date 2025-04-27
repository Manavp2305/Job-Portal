// components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect to login page if the user is not logged in
    return <Navigate to="/login" />;
  }

  return children; // Allow access to protected routes
};

export default PrivateRoute;
