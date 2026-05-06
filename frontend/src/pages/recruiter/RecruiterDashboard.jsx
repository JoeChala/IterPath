import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import RecruiterSidebar from "../../components/recruiter/RecruiterSidebar";
import DashboardStats from "../../components/recruiter/DashboardStats";
import JobList from "../../components/recruiter/JobList";
import ApplicantsList from "../../components/recruiter/ApplicantList";
import "../../css/RecruiterDashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, { credentials: "include" });
        if (!res.ok) throw new Error("unauth");
        const data = await res.json();
        if (active && data.role !== "recruiter") {
          navigate("/r/login", { replace: true });
        }
      } catch {
        if (active) navigate("/r/login", { replace: true });
      } finally {
        if (active) setCheckingAuth(false);
      }
    };

    check();
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/r/login", { replace: true });
  };

  const renderContent = () => {
    if (activeTab === "dashboard") return <DashboardStats />;
    if (activeTab === "jobs")
      return <JobList setActiveTab={setActiveTab} setSelectedJob={setSelectedJob} />;
    if (activeTab === "applicants")
      return <ApplicantsList selectedJob={selectedJob} setSelectedJob={setSelectedJob} />;
  };

  if (checkingAuth) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <p>Checking access...</p>
      </div>
    );
  }

  return (
    <div className="recruiter-dashboard-page">
      <RecruiterSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="recruiter-dashboard-main">
        <div className="recruiter-dashboard-shell">
          <header className="recruiter-dashboard-header">
            <div>
              <p className="recruiter-dashboard-eyebrow">Recruiter Portal</p>
              <h1 className="recruiter-dashboard-title">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "jobs" && "Jobs"}
                {activeTab === "applicants" && "Applicants"}
              </h1>
            </div>
            <button
              className="recruiter-logout-button"
              onClick={handleLogout}
              type="button"
            >
              <span>Logout</span>
              <LogOut size={16} />
            </button>
          </header>

          {renderContent()}
        </div>
      </main>
    </div>
  );
}
