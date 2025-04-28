// App.jsx
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
import "quill/dist/quill.snow.css"; // Ensure Quill's styles are imported for the editor
import AnswerPage from "./pages/AnswerPage";
import DiscussionForum from "./pages/DiscussionForum";

const App = () => {
  return (
    <>
      {/* ✅ Ensure this is the only Navbar rendering */}
      {/* Uncomment below if you have a Navbar component */}
      {/* <Navbar /> */}
      
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/apply-job/:id" element={<ApplyJob />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/discussion-forum/:questionId" element={<DiscussionForum />} />
          {/* Protected Routes (Dashboard, Add Job, Manage Jobs, View Applications) */}
          <Route path="/dashboard" element={<Dashboard />}>
            {/* Nested routes under dashboard */}
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
