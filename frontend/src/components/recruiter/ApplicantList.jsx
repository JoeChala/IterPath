import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function ApplicantsList({ selectedJob }) {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    if (!selectedJob) return;

    fetch(`${API_BASE_URL}/api/recruiter/applicants/${selectedJob}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setApplicants(data));
  }, [selectedJob]);

  const updateStatus = async (id, status) => {
    await fetch(`${API_BASE_URL}/api/recruiter/applications/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
  };

  if (!selectedJob) {
    return (
      <section className="recruiter-panel">
        <p className="recruiter-muted-text">Select a job first.</p>
      </section>
    );
  }

  return (
    <section className="recruiter-panel">
      <h2 className="recruiter-section-title">Applicants</h2>

      <div className="recruiter-list">
        {applicants.length === 0 && (
          <p className="recruiter-muted-text">No applicants yet.</p>
        )}

        {applicants.map(app => (
          <article key={app._id} className="recruiter-list-item">
            <h3 className="recruiter-list-title">
              {app.student?.name || "Unnamed applicant"}
            </h3>
            <p className="recruiter-list-meta">Status: {app.status}</p>

            <div className="recruiter-actions">
              <button
                className="recruiter-btn success"
                onClick={() => updateStatus(app._id, "shortlisted")}
                type="button"
              >
                <Check size={16} />
                Shortlist
              </button>

              <button
                className="recruiter-btn danger"
                onClick={() => updateStatus(app._id, "rejected")}
                type="button"
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
