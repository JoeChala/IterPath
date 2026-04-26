import { useEffect, useState } from "react";

export default function DashboardStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/recruiter/dashboard", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Jobs: {stats.totalJobs}</p>
      <p>Total Applicants: {stats.totalApplicants}</p>
      <p>Shortlisted: {stats.shortlisted}</p>
    </div>
  );
}