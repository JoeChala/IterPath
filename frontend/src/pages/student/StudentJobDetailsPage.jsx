import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../../css/StudentJobDetails.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function StudentPostingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [posting, setPosting] = useState(state?.posting || null);
  const [loading, setLoading] = useState(!state?.posting);
  const [error, setError] = useState("");

  useEffect(() => {
    if (posting || !id) return;

    const fetchPosting = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/student/jobs/${id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Posting not found");
        }

        setPosting(data.data);
      } catch (err) {
        setError(err.message || "Posting not found");
      } finally {
        setLoading(false);
      }
    };

    fetchPosting();
  }, [id, posting]);

  if (loading || !posting) {
    return (
      <div className="detail-page">
        <div className="detail-container">
          <p className="detail-not-found">
            {loading ? "Loading posting..." : error || "Posting not found."}
          </p>
          <button
            className="detail-back"
            onClick={() => navigate("/s/dashboard")}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  const days = Math.ceil(
    (new Date(posting.deadline) - new Date()) / (1000 * 60 * 60 * 24),
  );
  const urgent = days <= 5;

  return (
    <div className="detail-page">
      <div className="detail-container">
        {/* Back */}
        <button className="detail-back" onClick={() => navigate("/s/dashboard")}>
          ← Back to Postings
        </button>

        {/* Header */}
        <div className="detail-header">
          <div>
            <p className="detail-eyebrow">Placement Posting</p>
            <h1 className="detail-company">{posting.company}</h1>
            <p className="detail-role">{posting.role}</p>
          </div>
          <span className={`detail-deadline ${urgent ? "urgent" : ""}`}>
            {urgent ? "⚠ " : ""}
            {days > 0 ? `${days}d left` : "Closed"}
          </span>
        </div>

        <div className="detail-divider" />

        {/* Stats row */}
        <div className="detail-stats">
          <div className="detail-stat">
            <span className="detail-stat-label">CTC / Package</span>
            <span className="detail-stat-value">{posting.ctc}</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat-label">Openings</span>
            <span className="detail-stat-value">{posting.openings}</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat-label">Deadline</span>
            <span className="detail-stat-value">
              {new Date(posting.deadline).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="detail-divider" />

        {/* Job description */}
        <div className="detail-section">
          <h2 className="detail-section-title">Job Description</h2>
          <p className="detail-section-body">{posting.description}</p>
        </div>

        {/* Eligibility */}
        <div className="detail-section">
          <h2 className="detail-section-title">Eligibility Criteria</h2>
          <div className="detail-eligibility">
            <div className="detail-elig-row">
              <span className="detail-elig-key">Min. CGPA</span>
              <span className="detail-elig-val">
                {posting.eligibility.cgpa}
              </span>
            </div>
            <div className="detail-elig-row">
              <span className="detail-elig-key">Branches</span>
              <span className="detail-elig-val">
                {posting.eligibility.branches.join(", ")}
              </span>
            </div>
            <div className="detail-elig-row">
              <span className="detail-elig-key">Backlogs</span>
              <span className="detail-elig-val">
                {posting.eligibility.backlogs === 0
                  ? "No active backlogs"
                  : `${posting.eligibility.backlogs} backlog${posting.eligibility.backlogs === 1 ? "" : "s"}`}
              </span>
            </div>
          </div>
        </div>

        {/* Company website */}
        <div className="detail-section">
          <h2 className="detail-section-title">Company</h2>
          <a
            href={posting.website}
            target="_blank"
            rel="noreferrer"
            className="detail-link"
          >
            {posting.website} ↗
          </a>
        </div>

        <div className="detail-divider" />

        {/* Apply */}
        <a
          href={posting.applyLink}
          target="_blank"
          rel="noreferrer"
          className="detail-apply-btn"
        >
          Apply Now →
        </a>
      </div>
    </div>
  );
}

export default StudentPostingPage;
