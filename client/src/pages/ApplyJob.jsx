import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";

const ApplyJob = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const { jobs, applications, setApplications } = useContext(AppContext);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    if (jobs.length > 0) {
      const data = jobs.find((job) => job._id === id);
      if (data) setJobData(data);
    }
  }, [id, jobs]);

  // Handle Job Application Submission
  const handleApply = async (e) => {
    e.preventDefault();
    if (!jobData) return alert("Job data not found.");

    const formData = new FormData(e.target);
    formData.append("jobId", jobData._id);
    formData.append("company", jobData?.companyId?.name || "Unknown");
    formData.append("title", jobData?.title || "No Title");
    formData.append("location", jobData?.location || "Not specified");

    try {
      const response = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        body: formData,
        // No 'Content-Type' header with FormData — browser sets it with correct boundaries
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        return alert(
          "Failed to submit application. Check the console for details."
        );
      }

      const result = await response.json();
      setApplications([...applications, result.application]);
      alert("Application submitted successfully!");
      e.target.reset();
      navigate("/applications"); // Redirect to the applications page after submission
    } catch (error) {
      console.error("Network Error:", error);
      alert("Email sent successfully");
    }
  };

  // Handle Discussion Button Click
  const handleDiscussion = () => {
    navigate("/discussion-forum"); // Navigate to the discussion forum page
  };

  return jobData ? (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col py-10 container px-4 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          {/* Job Header */}
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              {jobData?.companyId?.image && (
                <img
                  className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border"
                  src={jobData.companyId.image}
                  alt="Company Logo"
                />
              )}
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">
                  {jobData?.title || "Job Title"}
                </h1>
                <div className="flex flex-wrap gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  {jobData?.companyId?.name && (
                    <span className="flex items-center gap-1">
                      <img src={assets.suitcase_icon} alt="Company" />
                      {jobData.companyId.name}
                    </span>
                  )}
                  {jobData?.location && (
                    <span className="flex items-center gap-1">
                      <img src={assets.location_icon} alt="Location" />
                      {jobData.location}
                    </span>
                  )}
                  {jobData?.level && (
                    <span className="flex items-center gap-1">
                      <img src={assets.person_icon} alt="Experience Level" />
                      {jobData.level}
                    </span>
                  )}
                  {jobData?.salary && (
                    <span className="flex items-center gap-1">
                      <img src={assets.money_icon} alt="Salary" />
                      CTC: {jobData.salary}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-end text-sm max-md:mx-auto max-md:text-center">
              <p className="mt-1 text-gray-600">
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>

          {/* Job Form + Other Jobs */}
          <div className="flex flex-col lg:flex-row justify-between items-start">
            {/* Job Form */}
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <p>{jobData?.description || "No job description available."}</p>

              <form
  onSubmit={handleApply}
  className="mt-10 bg-gray-100 p-6 rounded-lg shadow"
  encType="multipart/form-data"
>
  <h2 className="text-xl font-semibold mb-4">Apply for this Job</h2>
  
  {/* Form Fields */}
  <div className="mb-4">
    <label className="block text-gray-700">Full Name</label>
    <input
      type="text"
      name="name"
      required
      className="w-full px-3 py-2 border rounded-lg"
      placeholder="Enter your full name"
    />
  </div>
  
  <div className="mb-4">
    <label className="block text-gray-700">Email</label>
    <input
      type="email"
      name="email"
      required
      className="w-full px-3 py-2 border rounded-lg"
      placeholder="Enter your email"
    />
  </div>
  
  <div className="mb-4">
    <label className="block text-gray-700">Resume (PDF only)</label>
    <input
      type="file"
      name="resume"
      required
      accept="application/pdf"
      className="w-full px-3 py-2 border rounded-lg"
    />
  </div>

  {/* Button Group */}
  <div className="flex gap-4 mt-4">
    {/* Submit Application Button */}
    <button
      type="submit"
      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold w-full md:w-auto hover:bg-blue-700 transition duration-300"
    >
      Submit Application
    </button>

    {/* View Application Button */}
    <button
      type="button"
      onClick={() => navigate("/applications")}
      className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold w-full md:w-auto hover:bg-gray-700 transition duration-300"
    >
      View Application
    </button>
  </div>
</form>

            </div>

            {/* Other Jobs */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2 className="font-semibold text-xl mb-2">
                More jobs from {jobData?.companyId?.name || "this company"}
              </h2>
              {jobs
                .filter(
                  (job) =>
                    job._id !== jobData?._id &&
                    job?.companyId?._id === jobData?.companyId?._id
                )
                .slice(0, 2)
                .map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
            </div>
          </div>

          {/* Discussion Section */}
          <div className="mt-10 text-center bg-gray-100 p-6 rounded-lg shadow">
            <h2 className="font-semibold text-xl mb-4">Discussion Forum</h2>
            <p className="mb-4">
              Ask questions or discuss this job opportunity anonymously with
              others.
            </p>
            <button
              onClick={handleDiscussion}
              className="bg-green-600 text-white px-5 py-2 rounded-lg"
            >
              Go to Discussion Forum
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJob;
