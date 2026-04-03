import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/StudentLoginPage.css";

function StudentLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginStudent = async () => {
    const res = await fetch("http://localhost:5000/auth/students/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Login successful");
      navigate("/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <p className="login-eyebrow">Student Portal</p>
          <h1 className="login-title">Sign In/Sign Up</h1>
        </div>

        <div className="login-divider" />

        <div className="login-field">
          <label className="login-label">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            onFocus={(e) => e.target.style.borderColor = "var(--foreground)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        <div className="login-field">
          <label className="login-label">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            onFocus={(e) => e.target.style.borderColor = "var(--foreground)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        <button onClick={loginStudent} className="login-btn-primary">
          Login
        </button>

        <div className="login-footer">
          <span className="login-footer-text">New student?</span>
          <button
            onClick={() => navigate("/register")}
            className="login-btn-ghost"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentLoginPage;