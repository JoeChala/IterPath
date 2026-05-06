import { useEffect, useState } from "react";
import { Check, X, FileText } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function ApplicantsList({ selectedJob, setSelectedJob }) {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState("");
  const [minCgpa, setMinCgpa] = useState("");

  // Fetch jobs for the dropdown
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/recruiter/jobs`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setJobs(data);
          // Auto-select the first job if none is selected and jobs exist
          if (!selectedJob && data.length > 0) {
            setSelectedJob(data[0]._id);
          }
        }
      })
      .catch(() => setError("Could not load jobs"));
  }, [selectedJob, setSelectedJob]);

  // Fetch applicants when selectedJob changes
  useEffect(() => {
    if (!selectedJob) {
      return;
    }

    fetch(`${API_BASE_URL}/api/recruiter/applicants/${selectedJob}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setApplicants(data);
          setError("");
        } else {
          setApplicants([]);
          setError(data.message || "Could not load applicants");
        }
      })
      .catch(() => setError("Could not load applicants"));
  }, [selectedJob]);

  const updateStatus = async (id, status) => {
    const res = await fetch(`${API_BASE_URL}/api/recruiter/applications/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Could not update status");
      return;
    }

    setApplicants((current) =>
      current.map((app) => (app._id === id ? data.data : app))
    );
  };

  const filteredApplicants = applicants.filter((app) => {
    if (!minCgpa) return true;
    const cgpa = app.student?.resumeDetails?.cgpa || 0;
    return cgpa >= parseFloat(minCgpa);
  });

  const visibleApplicants = selectedJob ? filteredApplicants : [];

  const formatList = (value) => {
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  return (
    <section className="recruiter-panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <h2 className="recruiter-section-title" style={{ marginBottom: 0 }}>Applicants</h2>
        
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <select 
            value={selectedJob || ""} 
            onChange={(e) => setSelectedJob(e.target.value)}
            className="recruiter-input"
            style={{ width: "auto", minWidth: "200px", padding: "0.5rem" }}
          >
            <option value="" disabled>Select a job</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>
                {job.role}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min CGPA"
            value={minCgpa}
            onChange={(e) => setMinCgpa(e.target.value)}
            className="recruiter-input"
            style={{ width: "120px", padding: "0.5rem" }}
            step="0.1"
            min="0"
            max="10"
          />
        </div>
      </div>

      <div className="recruiter-list">
        {error && <p className="recruiter-error">{error}</p>}
        
        {!error && (!selectedJob || jobs.length === 0) && (
          <p className="recruiter-muted-text">Select a job from the dropdown to view applicants.</p>
        )}

        {!error && selectedJob && applicants.length === 0 && (
          <p className="recruiter-muted-text">No applicants found for this job yet.</p>
        )}

        {!error && selectedJob && applicants.length > 0 && filteredApplicants.length === 0 && (
          <p className="recruiter-muted-text">No applicants meet the CGPA filter criteria.</p>
        )}

        {visibleApplicants.map(app => {
          const skills = formatList(app.student?.resumeDetails?.skills);
          const links = formatList(app.student?.resumeDetails?.links);

          return (
          <article key={app._id} className="recruiter-list-item" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <h3 className="recruiter-list-title">
                {app.student?.name || "Unnamed applicant"}
              </h3>
              <p className="recruiter-list-meta">
                {app.student?.usn || "No USN"} · {app.student?.email || "No email"}
              </p>
              <p className="recruiter-list-meta">Status: <strong style={{ textTransform: "capitalize" }}>{app.status}</strong></p>
            </div>

            {(app.student?.resume || app.student?.resumeDetails) && (
              <div className="recruiter-resume-card">
                <div className="recruiter-resume-header">
                  <div>
                    <p className="recruiter-resume-eyebrow">Resume snapshot</p>
                    <h4 className="recruiter-resume-title">
                      {app.student.resume?.fileName || "Uploaded resume"}
                    </h4>
                  </div>
                  <FileText size={18} />
                </div>

                {app.student.resume?.uploadedAt && (
                  <p className="recruiter-resume-meta">
                    Uploaded {new Date(app.student.resume.uploadedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}

                <div className="recruiter-resume-grid">
                  <div className="recruiter-resume-field">
                    <span className="recruiter-resume-label">Email</span>
                    <span className="recruiter-resume-value">{app.student.resumeDetails?.email || "Not found"}</span>
                  </div>
                  <div className="recruiter-resume-field">
                    <span className="recruiter-resume-label">Phone</span>
                    <span className="recruiter-resume-value">{app.student.resumeDetails?.phone || "Not found"}</span>
                  </div>
                  <div className="recruiter-resume-field">
                    <span className="recruiter-resume-label">CGPA</span>
                    <span className="recruiter-resume-value">{app.student.resumeDetails?.cgpa ?? "Not found"}</span>
                  </div>
                  <div className="recruiter-resume-field recruiter-resume-field-wide">
                    <span className="recruiter-resume-label">Skills</span>
                    <div className="recruiter-chip-list">
                      {skills.length ? (
                        skills.map((skill) => (
                          <span key={skill} className="recruiter-chip">{skill}</span>
                        ))
                      ) : (
                        <span className="recruiter-resume-value">No skills detected</span>
                      )}
                    </div>
                  </div>
                  <div className="recruiter-resume-field recruiter-resume-field-wide">
                    <span className="recruiter-resume-label">Links</span>
                    <div className="recruiter-chip-list">
                      {links.length ? (
                        links.map((link) => (
                          <a key={link} href={link} target="_blank" rel="noreferrer" className="recruiter-link-chip">
                            {link}
                          </a>
                        ))
                      ) : (
                        <span className="recruiter-resume-value">No links detected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="recruiter-actions" style={{ marginTop: "0.5rem" }}>
              <button
                className="recruiter-btn success"
                onClick={() => updateStatus(app._id, "shortlisted")}
                type="button"
                disabled={app.status === "shortlisted"}
                style={{ opacity: app.status === "shortlisted" ? 0.5 : 1, cursor: app.status === "shortlisted" ? "not-allowed" : "pointer" }}
              >
                <Check size={16} />
                Shortlist
              </button>

              <button
                className="recruiter-btn danger"
                onClick={() => updateStatus(app._id, "rejected")}
                type="button"
                disabled={app.status === "rejected"}
                style={{ opacity: app.status === "rejected" ? 0.5 : 1, cursor: app.status === "rejected" ? "not-allowed" : "pointer" }}
              >
                <X size={16} />
                Reject
              </button>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}
