import { useEffect, useState } from "react";
import "../css/RecruiterOnboarding.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DESIGNATION_OPTIONS = [
  { value: "hr-executive", label: "HR Executive" },
  { value: "hr-manager", label: "HR Manager" },
  {
    value: "talent-acquisition-specialist",
    label: "Talent Acquisition Specialist",
  },
  {
    value: "talent-acquisition-manager",
    label: "Talent Acquisition Manager",
  },
  { value: "campus-recruiter", label: "Campus Recruiter" },
  { value: "hiring-manager", label: "Hiring Manager" },
  { value: "software-engineer", label: "Software Engineer" },
  { value: "senior-software-engineer", label: "Senior Software Engineer" },
  { value: "engineering-manager", label: "Engineering Manager" },
  { value: "other", label: "Other" },
];

export default function Onboarding() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
    designation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch current recruiter (to prefill email)
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load user");
        }

        return data;
      })
      .then(data => {
        if (data?.email) {
          setForm(prev => ({
            ...prev,
            email: data.email,
            companyName: data.company || "",
          }));
        }
      })
      .catch((err) => setError(err.message || "Failed to load user"));
  }, []);

  // Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit onboarding
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/recruiter/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Redirect to dashboard
      window.location.href = "/r/dashboard";

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <p className="onboarding-eyebrow">Recruiter Portal</p>
          <h1 className="onboarding-title">Complete Your Profile</h1>
          <p className="onboarding-subtitle">
            Finish your recruiter details before entering the dashboard.
          </p>
        </div>

        <div className="onboarding-divider" />

        {error && <p className="onboarding-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="onboarding-field">
            <label className="onboarding-label" htmlFor="recruiter-name">
              Full Name
            </label>
            <input
              id="recruiter-name"
              className="onboarding-input"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="onboarding-field">
            <label className="onboarding-label" htmlFor="recruiter-email">
              Email
            </label>
            <input
              id="recruiter-email"
              className="onboarding-input"
              name="email"
              value={form.email}
              disabled
            />
          </div>

          <div className="onboarding-field">
            <label className="onboarding-label" htmlFor="recruiter-company">
              Company
            </label>
            <input
              id="recruiter-company"
              className="onboarding-input"
              name="companyName"
              placeholder="Enter company name"
              value={form.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="onboarding-field">
            <label className="onboarding-label" htmlFor="recruiter-designation">
              Designation
            </label>
            <select
              id="recruiter-designation"
              className="onboarding-select"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select designation
              </option>
              {DESIGNATION_OPTIONS.map((designation) => (
                <option key={designation.value} value={designation.value}>
                  {designation.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="onboarding-btn-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
