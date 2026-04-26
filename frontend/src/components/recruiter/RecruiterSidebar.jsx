import { BriefcaseBusiness, LayoutDashboard, Users } from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "jobs", label: "Jobs", Icon: BriefcaseBusiness },
  { id: "applicants", label: "Applicants", Icon: Users },
];

export default function RecruiterSidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="recruiter-sidebar">
      <h2 className="recruiter-sidebar-title">IterPath</h2>
      <p className="recruiter-sidebar-subtitle">Recruiter workspace</p>

      <nav className="recruiter-nav">
        {navItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`recruiter-nav-button ${activeTab === id ? "active" : ""}`}
            onClick={() => setActiveTab(id)}
            type="button"
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
