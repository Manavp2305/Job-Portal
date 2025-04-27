import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

// Create Context
export const AppContext = createContext(); // ✅ Named export for context

const AppContextProvider = ({ children }) => {
  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [user, setUser] = useState(null); // State to store the logged-in user
  const [applications, setApplications] = useState([]); // Added state to track applications

  // Load job data
  useEffect(() => {
    setJobs(jobsData);
    
    // Assuming you are getting user data from localStorage or a session
    const loggedInUser = JSON.parse(localStorage.getItem("user")); // Fetch user info from localStorage or from API
    if (loggedInUser) {
      setUser(loggedInUser); // Set user details
    }

    // Fetch applications (you can replace this with your actual API call)
    const fetchApplications = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/applications"); // Replace with your actual API URL
        const data = await response.json();
        setApplications(data); // Set the fetched applications
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);

  // Update application status
  const updateApplicationStatus = (applicationId, status) => {
    setApplications((prevApplications) =>
      prevApplications.map((app) =>
        app._id === applicationId ? { ...app, status } : app
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        searchFilter,
        setSearchFilter,
        isSearched,
        setIsSearched,
        jobs,
        setJobs,
        showRecruiterLogin,
        setShowRecruiterLogin,
        user, // Include user in context value
        applications, // Provide applications in context
        updateApplicationStatus, // Provide function to update application status
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider }; // ✅ Named export
