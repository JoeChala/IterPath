import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/StudentDashboard.css";
import Dash_Card from "../components/dashboard-card";
import { LogOut, Search, Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function daysLeft(deadline) {
  const diff = new Date(deadline) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

function StudentDashboard() {
  const navigate = useNavigate();
  const [postings, setPostings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/student/jobs`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load postings");
        }

        setPostings(data.data || []);
      } catch (err) {
        setError(err.message || "Failed to load postings");
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (!search) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 400); // adjust timing here

    return () => clearTimeout(timeout);
  }, [search]);

  const filtered = postings.filter(
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
          <span className="dash-search-icon">
            {loading ? (
              <Loader2 size={14} strokeWidth={2} className="dash-spinner" />
            ) : (
              <Search size={14} strokeWidth={2} />
            )}
          </span>
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
          {jobsLoading
            ? "Loading postings..."
            : `${filtered.length} posting${filtered.length !== 1 ? "s" : ""} found`}
        </p>

        {/* List */}
        <div className="dash-list">
          {error && <p className="dash-empty">{error}</p>}
          {!error && !jobsLoading && filtered.length === 0 && (
            <p className="dash-empty">No postings match your search.</p>
          )}
          {!error && filtered.map((posting, i) => {
            const days = daysLeft(posting.deadline);
            return (
              <Dash_Card key={posting._id} isUrgent={days <= 5} daysLeft={days} posting={posting} index={i}></Dash_Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
