import { useState } from "react";
import RecruiterSidebar from "../components/recruiter/RecruiterSidebar";
import DashboardStats from "../components/recruiter/DashboardStats";
import JobList from "../components/recruiter/JobList";
import ApplicantsList from "../components/recruiter/ApplicantList";
import "../css/RecruiterDashboard.css";

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedJob, setSelectedJob] = useState(null);

  const renderContent = () => {
    if (activeTab === "dashboard") return <DashboardStats />;
    if (activeTab === "jobs")
      return <JobList setSelectedJob={setSelectedJob} />;
    if (activeTab === "applicants")
      return <ApplicantsList selectedJob={selectedJob} />;
  };

  return (
    <div className="recruiter-dashboard-page">
      <RecruiterSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="recruiter-dashboard-main">
        <div className="recruiter-dashboard-shell">
          <header className="recruiter-dashboard-header">
            <p className="recruiter-dashboard-eyebrow">Recruiter Portal</p>
            <h1 className="recruiter-dashboard-title">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "jobs" && "Jobs"}
              {activeTab === "applicants" && "Applicants"}
            </h1>
          </header>

          {renderContent()}
        </div>
      </main>
    </div>
  );
}
