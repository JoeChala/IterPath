import { useState } from "react";
import { Plus } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function JobForm({ refreshJobs }) {
  const [form, setForm] = useState({
    role: "",
    ctc: "",
    openings: "",
    deadline: "",
    description: "",
    cgpa: "",
    branches: "",
    backlogs: "0",
    website: "",
    applyLink: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API_BASE_URL}/api/recruiter/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        role: form.role,
        ctc: form.ctc,
        openings: form.openings,
        deadline: form.deadline,
        description: form.description,
        eligibility: {
          cgpa: form.cgpa,
          branches: form.branches
            .split(",")
            .map((branch) => branch.trim())
            .filter(Boolean),
          backlogs: form.backlogs,
        },
        website: form.website,
        applyLink: form.applyLink,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Could not create job");
      return;
    }

    refreshJobs();
    setForm({
      role: "",
      ctc: "",
      openings: "",
      deadline: "",
      description: "",
      cgpa: "",
      branches: "",
      backlogs: "0",
      website: "",
      applyLink: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="recruiter-form-grid">
        <div className="recruiter-form-field">
          <label className="recruiter-label" htmlFor="job-role">Role</label>
          <input
            id="job-role"
            className="recruiter-input"
            placeholder="Software Engineer"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            required
          />
        </div>

        <div className="recruiter-form-field">
          <label className="recruiter-label" htmlFor="job-ctc">CTC</label>
          <input
            id="job-ctc"
            className="recruiter-input"
            placeholder="8 LPA"
            value={form.ctc}
            onChange={(e) => setForm({ ...form, ctc: e.target.value })}
            required
          />
        </div>

        <div className="recruiter-form-field">
          <label className="recruiter-label" htmlFor="job-openings">Openings</label>
          <input
            id="job-openings"
            className="recruiter-input"
            min="1"
            placeholder="3"
            type="number"
            value={form.openings}
            onChange={(e) => setForm({ ...form, openings: e.target.value })}
            required
          />
        </div>

        <div className="recruiter-form-field">
          <label className="recruiter-label" htmlFor="job-deadline">Deadline</label>
          <input
            id="job-deadline"
            className="recruiter-input"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            required
          />
        </div>

        <div className="recruiter-form-field">
          <label className="recruiter-label" htmlFor="job-cgpa">CGPA</label>
          <input
            id="job-cgpa"
            className="recruiter-input"
            max="10"
            min="0"
            placeholder="Minimum CGPA"
            step="0.01"
            type="number"
            value={form.cgpa}
            onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
            required
          />
        </div>

        <div className="recruiter-form-field">
          <label className="recruiter-label" htmlFor="job-backlogs">Backlogs</label>
          <input
            id="job-backlogs"
            className="recruiter-input"
            min="0"
            placeholder="0"
            type="number"
            value={form.backlogs}
            onChange={(e) => setForm({ ...form, backlogs: e.target.value })}
            required
          />
        </div>

        <div className="recruiter-form-field full">
          <label className="recruiter-label" htmlFor="job-branches">Branches</label>
          <input
            id="job-branches"
            className="recruiter-input"
            placeholder="CSE, ISE, ECE"
            value={form.branches}
            onChange={(e) => setForm({ ...form, branches: e.target.value })}
            required
          />
        </div>

        <div className="recruiter-form-field">
          <label className="recruiter-label" htmlFor="job-website">Website</label>
          <input
            id="job-website"
            className="recruiter-input"
            placeholder="https://company.com"
            type="url"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            required
          />
        </div>

        <div className="recruiter-form-field">
          <label className="recruiter-label" htmlFor="job-apply-link">Apply Link</label>
          <input
            id="job-apply-link"
            className="recruiter-input"
            placeholder="https://company.com/apply"
            type="url"
            value={form.applyLink}
            onChange={(e) => setForm({ ...form, applyLink: e.target.value })}
            required
          />
        </div>

        <div className="recruiter-form-field full">
          <label className="recruiter-label" htmlFor="job-description">
            Description
          </label>
          <textarea
            id="job-description"
            className="recruiter-textarea"
            placeholder="Describe the role"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>
      </div>

      {error && <p className="recruiter-error">{error}</p>}

      <div className="recruiter-actions">
        <button className="recruiter-btn primary" type="submit">
          <Plus size={16} />
          Create Job
        </button>
      </div>
    </form>
  );
}
