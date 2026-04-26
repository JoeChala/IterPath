import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function DashboardStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/recruiter/dashboard`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <p className="recruiter-muted-text">Loading...</p>;

  return (
    <section className="recruiter-panel">
      <div className="recruiter-stats-grid">
        <article className="recruiter-stat">
          <p className="recruiter-stat-label">Total Jobs</p>
          <p className="recruiter-stat-value">{stats.totalJobs ?? 0}</p>
        </article>

        <article className="recruiter-stat">
          <p className="recruiter-stat-label">Applicants</p>
          <p className="recruiter-stat-value">{stats.totalApplicants ?? 0}</p>
        </article>

        <article className="recruiter-stat">
          <p className="recruiter-stat-label">Shortlisted</p>
          <p className="recruiter-stat-value">{stats.shortlisted ?? 0}</p>
        </article>
      </div>
    </section>
  );
}
