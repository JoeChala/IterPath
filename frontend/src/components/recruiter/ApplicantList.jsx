import { useEffect, useState } from "react";

export default function ApplicantsList({ selectedJob }) {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    if (!selectedJob) return;

    fetch(`/api/recruiter/applicants/${selectedJob}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(data => setApplicants(data));
  }, [selectedJob]);

  const updateStatus = async (id, status) => {
    await fetch(`/api/recruiter/applications/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ status }),
    });
  };

  if (!selectedJob) return <p>Select a job first</p>;

  return (
    <div>
      <h2>Applicants</h2>

      {applicants.map(app => (
        <div key={app._id} style={{ border: "1px solid", margin: "10px" }}>
          <p>{app.student.name}</p>
          <p>Status: {app.status}</p>

          <button onClick={() => updateStatus(app._id, "shortlisted")}>
            Shortlist
          </button>

          <button onClick={() => updateStatus(app._id, "rejected")}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}