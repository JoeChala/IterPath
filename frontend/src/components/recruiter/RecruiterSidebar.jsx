export default function RecruiterSidebar({ setActiveTab }) {
  return (
    <div style={{ width: "200px", background: "#eee", padding: "20px" }}>
      <h3>Recruiter</h3>

      <button onClick={() => setActiveTab("dashboard")}>
        Dashboard
      </button>

      <button onClick={() => setActiveTab("jobs")}>
        Jobs
      </button>

      <button onClick={() => setActiveTab("applicants")}>
        Applicants
      </button>
    </div>
  );
}