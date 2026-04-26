import { useState } from "react";
import RecruiterSidebar from "../components/recruiter/RecruiterSidebar";
import DashboardStats from "../components/recruiter/DashboardStats";
import JobList from "../components/recruiter/JobList";
import ApplicantsList from "../components/recruiter/ApplicantsList";

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
    <div style={{ display: "flex" }}>
      <RecruiterSidebar setActiveTab={setActiveTab} />
      <div style={{ flex: 1, padding: "20px" }}>
        {renderContent()}
      </div>
    </div>
  );
}