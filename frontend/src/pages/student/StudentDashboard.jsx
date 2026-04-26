import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/StudentDashboard.css";
import Dash_Card from "../../components/dashboard-card";
import { BriefcaseBusiness, LogOut, Search, Loader2, Upload, User } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function daysLeft(deadline) {
  const diff = new Date(deadline) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("postings");
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeMessage, setResumeMessage] = useState("");
  const [postings, setPostings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setProfile(data);
      } catch (err) {
        setProfileError(err.message || "Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

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

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/s/login", { replace: true });
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setResumeUploading(true);
    setResumeMessage("");

    try {
      const text = await file.text();
      const res = await fetch(`${API_BASE_URL}/api/student/resume/parse`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      console.log(data)

      if (!res.ok) {
        throw new Error(data.message || "Could not upload resume");
      }

      setProfile((current) => ({
        ...current,
        resumeDetails: data.data,
      }));
      setResumeMessage(data.message || "Resume details saved");
    } catch (err) {
      setResumeMessage(err.message || "Could not upload resume");
    } finally {
      setResumeUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="dash-page">
      <aside className="dash-sidebar">
        <h2 className="dash-sidebar-title">IterPath</h2>
        <p className="dash-sidebar-subtitle">Student workspace</p>

        <nav className="dash-nav">
          <button
            className={`dash-nav-button ${activeTab === "postings" ? "active" : ""}`}
            onClick={() => setActiveTab("postings")}
            type="button"
          >
            <BriefcaseBusiness size={18} />
            <span>Placement Postings</span>
          </button>
          <button
            className={`dash-nav-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
            type="button"
          >
            <User size={18} />
            <span>Profile</span>
          </button>
        </nav>
      </aside>

      <main className="dash-main">
        <div className="dash-container">
          {/* Top bar */}
          <div className="dash-topbar">
            <div>
              <p className="dash-eyebrow">Student Portal</p>
              <h1 className="dash-title">
                {activeTab === "postings" ? "Placement Postings" : "Profile"}
              </h1>
            </div>
            <button className="dash-logout" onClick={handleLogout} type="button">
              <span>Logout</span>
              <LogOut size={13} strokeWidth={2} />
            </button>
          </div>

          <div className="dash-divider" />

          {activeTab === "postings" && (
            <>
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
            </>
          )}

          {activeTab === "profile" && (
            <section className="dash-profile-card">
              {profileError && <p className="dash-empty">{profileError}</p>}
              {!profileError && !profile && (
                <p className="dash-empty">Loading profile...</p>
              )}
              {profile && (
                <>
                  <div className="dash-profile-grid">
                    <div className="dash-profile-row">
                      <span className="dash-profile-key">Name</span>
                      <span className="dash-profile-value">{profile.name || "Not set"}</span>
                    </div>
                    <div className="dash-profile-row">
                      <span className="dash-profile-key">USN</span>
                      <span className="dash-profile-value">{profile.usn || "Not set"}</span>
                    </div>
                    <div className="dash-profile-row">
                      <span className="dash-profile-key">Email</span>
                      <span className="dash-profile-value">{profile.email}</span>
                    </div>
                    <div className="dash-profile-row">
                      <span className="dash-profile-key">Role</span>
                      <span className="dash-profile-value">{profile.role}</span>
                    </div>
                  </div>

                  <div className="dash-resume-panel">
                    <div className="dash-resume-header">
                      <div>
                        <h2 className="dash-profile-section-title">Resume Details</h2>
                        <p className="dash-profile-help">
                          Upload a text-based resume to extract skills and contact details.
                        </p>
                      </div>
                      <label className="dash-upload-button">
                        <Upload size={15} />
                        <span>{resumeUploading ? "Reading..." : "Upload Resume"}</span>
                        <input
                          type="file"
                          accept=".txt,.pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          disabled={resumeUploading}
                        />
                      </label>
                    </div>

                    {resumeMessage && (
                      <p className="dash-resume-message">{resumeMessage}</p>
                    )}

                    {profile.resumeDetails ? (
                      <div className="dash-profile-grid">
                        <div className="dash-profile-row">
                          <span className="dash-profile-key">File</span>
                          <span className="dash-profile-value">
                            {profile.resumeDetails.fileName || "resume"}
                          </span>
                        </div>
                        <div className="dash-profile-row">
                          <span className="dash-profile-key">Email</span>
                          <span className="dash-profile-value">
                            {profile.resumeDetails.email || "Not found"}
                          </span>
                        </div>
                        <div className="dash-profile-row">
                          <span className="dash-profile-key">Phone</span>
                          <span className="dash-profile-value">
                            {profile.resumeDetails.phone || "Not found"}
                          </span>
                        </div>
                        <div className="dash-profile-row">
                          <span className="dash-profile-key">CGPA</span>
                          <span className="dash-profile-value">
                            {profile.resumeDetails.cgpa ?? "Not found"}
                          </span>
                        </div>
                        <div className="dash-profile-row">
                          <span className="dash-profile-key">Skills</span>
                          <span className="dash-profile-value">
                            {profile.resumeDetails.skills?.length
                              ? profile.resumeDetails.skills.join(", ")
                              : "No skills detected"}
                          </span>
                        </div>
                        <div className="dash-profile-row">
                          <span className="dash-profile-key">Links</span>
                          <span className="dash-profile-value">
                            {profile.resumeDetails.links?.length
                              ? profile.resumeDetails.links.join(", ")
                              : "No links detected"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="dash-empty">No resume details uploaded yet.</p>
                    )}
                  </div>
                </>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
