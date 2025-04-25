// ApplyJob.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ApplyJob = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApply = async (e) => {
    e.preventDefault();
    alert("You have successfully applied for the job.");
    // Here you can handle applying for the job (e.g., submitting form data, etc.)
  };

  if (!job) {
    return <div>Loading job details...</div>;
  }

  return (
    <div className="container p-4">
      <h2 className="text-xl font-medium mb-4">{job.title}</h2>
      <p>{job.description}</p>
      <div className="mt-4">
        <h3 className="text-lg">Apply Now</h3>
        <form onSubmit={handleApply} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="px-4 py-2 border-2 border-gray-300 rounded"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="px-4 py-2 border-2 border-gray-300 rounded"
            required
          />
          <textarea
            placeholder="Your Message"
            className="px-4 py-2 border-2 border-gray-300 rounded"
            rows="4"
            required
          ></textarea>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
            Apply
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyJob;
