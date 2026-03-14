import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentRegisterForm.css";

function StudentRegisterForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [usn, setUsn] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const studentRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("http://localhost:5000/auth/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, usn, password }),
    });
    const data = await res.json();
    if(data.success){
        alert("Student Registered");
        navigate("/dashboard");
    }
    else{
        alert(data.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <p className="register-eyebrow">Student Portal</p>
          <h1 className="register-title">Register</h1>
        </div>

        <div className="register-divider" />

        <div className="register-field">
          <label className="register-label">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="register-input"
          />
        </div>

        <div className="register-field">
          <label className="register-label">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="register-input"
          />
        </div>

        <div className="register-field">
          <label className="register-label">USN</label>
          <input
            type="text"
            placeholder="Enter USN"
            value={usn}
            onChange={(e) => setUsn(e.target.value)}
            className="register-input"
          />
        </div>

        <div className="register-field">
          <label className="register-label">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
          />
        </div>

        <div className="register-field">
          <label className="register-label">Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="register-input"
          />
        </div>

        <button onClick={studentRegister} className="register-btn-primary">
          Register
        </button>

        <div className="register-footer">
          <span className="register-footer-text">Already a student?</span>
          <button onClick={() => navigate("/")} className="register-btn-ghost">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentRegisterForm;