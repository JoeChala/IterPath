import { useEffect, useState } from "react";
import JobForm from "./JobForm";

export default function JobList({ setSelectedJob }) {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = () => {
    fetch("/api/recruiter/jobs", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(data => setJobs(data));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const deleteJob = async (id) => {
    await fetch(`/api/recruiter/jobs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    fetchJobs();
  };

  return (
    <div>
      <h2>Jobs</h2>

      <JobForm refreshJobs={fetchJobs} />

      {jobs.map(job => (
        <div key={job._id} style={{ border: "1px solid", margin: "10px" }}>
          <h3>{job.title}</h3>
          <button onClick={() => setSelectedJob(job._id)}>
            View Applicants
          </button>
          <button onClick={() => deleteJob(job._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}