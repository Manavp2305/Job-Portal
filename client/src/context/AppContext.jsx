import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

export const AppContext = createContext(); // ✅ Named export for context

const AppContextProvider = ({ children }) => {
  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  // Load job data
  useEffect(() => {
    setJobs(jobsData);
  }, []);

  return (
    <AppContext.Provider 
      value={{
        searchFilter, setSearchFilter, 
        isSearched, setIsSearched, 
        jobs, setJobs, 
        showRecruiterLogin, setShowRecruiterLogin
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider }; // ✅ Named export
