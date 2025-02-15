import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import Dashboard from "./pages/Dashboard";
import Addjob from "./pages/Addjob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
// import Navbar from "./components/Navbar";
import "quill/dist/quill.snow.css";

const App = () => {
  return (
    <> {/* ✅ Ensure this is the only Navbar rendering */}
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply-job/:id" element={<ApplyJob />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="add-job" element={<Addjob />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="view-applications" element={<ViewApplications />} />
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
