import { useState } from "react";

export default function JobForm({ refreshJobs }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    cgpa: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/recruiter/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(form),
    });

    refreshJobs();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        placeholder="Skills"
        onChange={(e) => setForm({ ...form, skills: e.target.value })}
      />

      <input
        placeholder="CGPA"
        onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
      />

      <button type="submit">Create Job</button>
    </form>
  );
}