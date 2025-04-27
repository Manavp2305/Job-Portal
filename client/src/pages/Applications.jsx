import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import moment from "moment";

const Applications = () => {
  const { user } = useContext(AppContext);
  const [applications, setApplications] = useState([]); // Local state for applications

  useEffect(() => {
    // Fetch the applications from the API when the component is mounted
    const fetchApplications = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/applications");
        const data = await response.json();
        setApplications(data); // Set the fetched applications
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []); // Empty dependency array to fetch only once when the component is mounted

  const safeApplications = applications || [];

  // If user is logged in, filter the applications based on email, otherwise show all applications
  const userEmail = user?.email;
  const userApplications = userEmail
    ? safeApplications.filter((job) => job.email === userEmail)
    : safeApplications;

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-10 px-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Job Applications</h2>

        {userApplications.length > 0 ? (
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-left">
                  <th className="py-3 px-4 font-semibold">Company</th>
                  <th className="py-3 px-4 font-semibold">Job Title</th>
                  <th className="py-3 px-4 font-semibold max-sm:hidden">Location</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  {user && <th className="py-3 px-4 font-semibold">Action</th>} {/* Show action column only if user is logged in */}
                </tr>
              </thead>
              <tbody>
                {userApplications.map((job, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{job.company}</td>
                    <td className="py-2 px-4">{job.title}</td>
                    <td className="py-2 px-4 max-sm:hidden">{job.location}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`${
                          job.status === "Accepted"
                            ? "bg-green-100 text-green-600"
                            : job.status === "Rejected"
                            ? "bg-red-200 text-red-600"
                            : "bg-blue-100 text-blue-600"
                        } w-20 h-8 flex items-center justify-center rounded-full text-xs font-semibold`}
                      >
                        {job.status}
                      </span>
                    </td>
                    {user && (
                      <td className="py-2 px-4">
                        {/* Show action buttons if user is logged in */}
                        <button className="text-blue-600 hover:underline">View</button>
                        <button className="text-yellow-600 hover:underline ml-2">Update</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-lg">No applications available at the moment.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Applications;
