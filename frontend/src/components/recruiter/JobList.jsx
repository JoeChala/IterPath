import { useEffect, useState } from "react";
import JobForm from "./JobForm";
import { Eye, Trash2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function JobList({ setSelectedJob }) {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = () => {
    fetch(`${API_BASE_URL}/api/recruiter/jobs`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setJobs(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const deleteJob = async (id) => {
    await fetch(`${API_BASE_URL}/api/recruiter/jobs/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchJobs();
  };

  return (
    <>
      <section className="recruiter-panel">
        <h2 className="recruiter-section-title">Create Job</h2>
        <JobForm refreshJobs={fetchJobs} />
      </section>

      <section className="recruiter-panel">
        <h2 className="recruiter-section-title">Open Jobs</h2>

        <div className="recruiter-list">
          {jobs.length === 0 && (
            <p className="recruiter-muted-text">No jobs posted yet.</p>
          )}

          {jobs.map(job => (
            <article key={job._id} className="recruiter-list-item">
              <h3 className="recruiter-list-title">
                {job.role || "Untitled Job"}
              </h3>
              {job.company && (
                <p className="recruiter-list-meta">{job.company}</p>
              )}

              <div className="recruiter-actions">
                <button
                  className="recruiter-btn"
                  onClick={() => setSelectedJob(job._id)}
                  type="button"
                >
                  <Eye size={16} />
                  View Applicants
                </button>
                <button
                  className="recruiter-btn danger"
                  onClick={() => deleteJob(job._id)}
                  type="button"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
