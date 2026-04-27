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
  }, []);

  // Fetch applicants when selectedJob changes
  useEffect(() => {
    if (!selectedJob) {
      setApplicants([]);
      return;
    }

    setError("");
    fetch(`${API_BASE_URL}/api/recruiter/applicants/${selectedJob}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setApplicants(data);
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

        {filteredApplicants.map(app => (
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

            {/* Resume Object Details */}
            {(app.student?.resume || app.student?.resumeDetails) && (
              <div style={{ backgroundColor: "var(--background)", padding: "0.75rem", borderRadius: "6px", fontSize: "0.875rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", fontWeight: "600", color: "var(--primary)" }}>
                  <FileText size={16} />
                  Resume Object
                </div>
                
                {app.student.resume && (
                  <div style={{ marginBottom: "0.5rem" }}>
                    <strong>Resume Meta:</strong>
                    <pre style={{ margin: "0.25rem 0 0 0", padding: "0.5rem", background: "rgba(0,0,0,0.05)", borderRadius: "4px", overflowX: "auto" }}>
                      {JSON.stringify(app.student.resume, null, 2)}
                    </pre>
                  </div>
                )}
                
                {app.student.resumeDetails && (
                  <div>
                    <strong>Parsed Resume Details:</strong>
                    <pre style={{ margin: "0.25rem 0 0 0", padding: "0.5rem", background: "rgba(0,0,0,0.05)", borderRadius: "4px", overflowX: "auto", maxHeight: "200px" }}>
                      {JSON.stringify(app.student.resumeDetails, null, 2)}
                    </pre>
                  </div>
                )}
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
        ))}
      </div>
    </section>
  );
}
