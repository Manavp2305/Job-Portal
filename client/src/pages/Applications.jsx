import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import moment from "moment";

const Applications = () => {
  const { applications } = useContext(AppContext);

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-10 px-4">
        <h2 className="text-2xl font-bold mb-6">Your Job Applications</h2>

        {applications.length > 0 ? (
          <table className="w-full bg-white border rounded-lg">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b text-left">Company</th>
                <th className="py-3 px-4 border-b text-left">Job Title</th>
                <th className="py-3 px-4 border-b text-left max-sm:hidden">Location</th>
                <th className="py-3 px-4 border-b text-left max-sm:hidden">Date</th>
                <th className="py-3 px-4 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((job, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 border-b">{job.company}</td>
                  <td className="py-2 px-4 border-b">{job.title}</td>
                  <td className="py-2 px-4 border-b max-sm:hidden">{job.location}</td>
                  <td className="py-2 px-4 border-b max-sm:hidden">{moment(job.date).format("ll")}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`${
                        job.status === "Accepted"
                          ? "bg-green-100"
                          : job.status === "Rejected"
                          ? "bg-red-200"
                          : "bg-blue-100"
                      } w-20 h-8 flex items-center justify-center rounded`}
                    >
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">You have not applied for any jobs yet.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Applications;
