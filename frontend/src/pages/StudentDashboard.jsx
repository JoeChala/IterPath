import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/StudentDashboard.css";
import Dashboard_card from "../components/dashboard-card";
import { LogOut } from "lucide-react"

const MOCK_POSTINGS = [
  {
    id: 1,
    company: "Google",
    role: "Software Engineer",
    deadline: "2026-04-20",
    ctc: "45 LPA",
    openings: 12,
    website: "https://google.com",
    description:
      "Join Google's core engineering team working on large-scale distributed systems. You'll design, build, and maintain systems that serve billions of users globally.",
    eligibility: {
      cgpa: "8.0",
      branches: ["CSE", "ISE", "ECE"],
      backlogs: "No active backlogs",
    },
    applyLink: "https://careers.google.com",
  },
  {
    id: 2,
    company: "Microsoft",
    role: "SDE - I",
    deadline: "2026-04-25",
    ctc: "40 LPA",
    openings: 8,
    website: "https://microsoft.com",
    description:
      "Work on Microsoft Azure infrastructure and developer tooling. Build reliable, scalable cloud services used by millions of enterprises worldwide.",
    eligibility: {
      cgpa: "7.5",
      branches: ["CSE", "ISE", "ECE", "EEE"],
      backlogs: "No active backlogs",
    },
    applyLink: "https://careers.microsoft.com",
  },
  {
    id: 3,
    company: "Flipkart",
    role: "Backend Engineer",
    deadline: "2026-05-01",
    ctc: "28 LPA",
    openings: 20,
    website: "https://flipkart.com",
    description:
      "Build the backend systems powering India's largest e-commerce platform. Work on high-throughput APIs, payment systems, and order management pipelines.",
    eligibility: {
      cgpa: "7.0",
      branches: ["CSE", "ISE", "ECE", "EEE", "MECH"],
      backlogs: "Max 1 history backlog allowed",
    },
    applyLink: "https://careers.flipkart.com",
  },
  {
    id: 4,
    company: "Atlassian",
    role: "Full Stack Developer",
    deadline: "2026-05-10",
    ctc: "35 LPA",
    openings: 5,
    website: "https://atlassian.com",
    description:
      "Contribute to Jira, Confluence, and Bitbucket — tools used by millions of developers. Work in small, autonomous teams with end-to-end ownership.",
    eligibility: {
      cgpa: "8.5",
      branches: ["CSE", "ISE"],
      backlogs: "No backlogs of any kind",
    },
    applyLink: "https://www.atlassian.com/company/careers",
  },
];

function daysLeft(deadline) {
  const diff = new Date(deadline) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

function StudentDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = MOCK_POSTINGS.filter(
    (p) =>
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="dash-page">
      <div className="dash-container">
        {/* Top bar */}
        <div className="dash-topbar">
          <div>
            <p className="dash-eyebrow">Student Portal</p>
            <h1 className="dash-title">Placement Postings</h1>
          </div>
          <button className="dash-logout flex items-center gap-2" onClick={() => navigate("/")}>
            <span>Logout</span>
            <LogOut size={13} strokeWidth={2} className="translate-y-[1px]" />
          </button>
        </div>

        <div className="dash-divider" />

        {/* Search */}
        <div className="dash-search-wrap">
          <span className="dash-search-icon">⌕</span>
          <input
            className="dash-search"
            type="text"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Count */}
        <p className="dash-count">
          {filtered.length} posting{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* List */}
        <div className="dash-list">
          {filtered.length === 0 && (
            <p className="dash-empty">No postings match your search.</p>
          )}
          {filtered.map((posting, i) => {
            const days = daysLeft(posting.deadline);
            return (
              <Dashboard_card isUrgent={days <= 5} daysLeft={days} posting={posting} index={i}></Dashboard_card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
