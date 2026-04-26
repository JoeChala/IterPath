import { useEffect, useState } from "react";

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
    fetch("/api/auth/me", {
      credentials: "include", // IMPORTANT for cookies
    })
      .then(res => res.json())
      .then(data => {
        if (data?.email) {
          setForm(prev => ({
            ...prev,
            email: data.email,
            companyName: data.company || "",
          }));
        }
      })
      .catch(() => setError("Failed to load user"));
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
      const res = await fetch("/recruiter/complete-profile", {
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
      window.location.href = "/recruiter/dashboard";

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto" }}>
      <h2>Complete Your Profile</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          value={form.email}
          disabled
        />

        <input
          name="companyName"
          placeholder="Company"
          value={form.companyName}
          onChange={handleChange}
          required
        />

        <input
          name="designation"
          placeholder="Designation"
          value={form.designation}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Complete Profile"}
        </button>
      </form>
    </div>
  );
}