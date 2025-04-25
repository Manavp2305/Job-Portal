import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/applications");
        console.log("Fetched applications:", res.data);

        if (Array.isArray(res.data)) {
          setApplications(res.data);
        } else {
          console.error("API did not return an array.");
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);

  const getResumeLink = (resumePath) => {
    if (!resumePath) return null;
    return `http://localhost:5000/${resumePath.replace(/\\/g, "/")}`;
  };

  const handleAction = async (action, applicationId, applicantEmail, applicantName, jobTitle, companyName) => {
    try {
      // Perform the accept/reject action by calling the API
      const res = await axios.post("http://localhost:5000/api/applications/acceptReject", {
        applicationId,
        action,
        applicantEmail,
        applicantName,
        jobTitle,
        companyName,
      });

      alert(`${action === "accept" ? "Shortlisted" : "Not shortlisted"} email sent.`);

      // Re-fetch the list of applications to update the UI with the new status
      const updatedRes = await axios.get("http://localhost:5000/api/applications");
      if (Array.isArray(updatedRes.data)) {
        setApplications(updatedRes.data); // Update the state with the new application list
      } else {
        console.error("Updated applications response is not an array.");
      }

    } catch (error) {
      console.error("Error handling action:", error);
      if (error.response) {
        alert(`Server Error: ${error.response.data.message || 'Something went wrong.'}`);
      } else if (error.request) {
        alert("No response from server.");
      } else {
        alert("Error setting up request.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left">#</th>
            <th className="py-2 px-4 text-left">User name</th>
            <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
            <th className="py-2 px-4 text-left max-sm:hidden">Company</th>
            <th className="py-2 px-4 text-left">Resume</th>
            <th className="py-2 px-4 text-left">Action</th>
            <th className="py-2 px-4 text-left">Status</th> {/* Added Status column */}
          </tr>
        </thead>
        <tbody>
          {applications.map((applicant, index) => (
            <tr key={index} className="text-gray-700">
              <td className="py-2 px-4 border-b text-center">{index + 1}</td>
              <td className="py-2 px-4 border-b text-center flex items-center gap-3">
                <img
                  className="w-10 h-10 rounded-full max-sm:hidden"
                  src={applicant.imgSrc || assets.default_profile}
                  alt="user"
                />
                <span>{applicant.name}</span>
              </td>
              <td className="py-2 px-4 border-b max-sm:hidden">{applicant.title}</td>
              <td className="py-2 px-4 border-b max-sm:hidden">{applicant.company}</td>
              <td className="py-2 px-4 border-b">
                {getResumeLink(applicant.resume) ? (
                  <a
                    href={getResumeLink(applicant.resume)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-50 text-blue-500 px-3 py-1 rounded inline-flex items-center gap-2"
                  >
                    Resume
                    <img
                      src={assets.resume_download_icon}
                      alt="download"
                      className="w-4 h-4"
                    />
                  </a>
                ) : (
                  <span className="text-gray-400">No Resume</span>
                )}
              </td>
              <td className="py-2 px-4 border-b">
                <div className="relative inline-block text-left group">
                  <button className="text-gray-500 action-button">...</button>
                  <div className="z-10 hidden absolute right-0 top-5 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                    <button
                      className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
                      onClick={() =>
                        handleAction(
                          "accept",
                          applicant._id,
                          applicant.email,
                          applicant.name,
                          applicant.title,
                          applicant.company
                        )
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                      onClick={() =>
                        handleAction(
                          "reject",
                          applicant._id,
                          applicant.email,
                          applicant.name,
                          applicant.title,
                          applicant.company
                        )
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </td>
              <td className="py-2 px-4 border-b">
                {/* Display Accepted or Rejected status */}
                {applicant.status === "Accepted" ? (
                  <span className="text-green-500 font-bold">Accepted</span>
                ) : applicant.status === "Rejected" ? (
                  <span className="text-red-500 font-bold">Rejected</span>
                ) : (
                  <span className="text-yellow-500">Pending</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {applications.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No applications found.</p>
      )}
    </div>
  );
};

export default ViewApplications;
