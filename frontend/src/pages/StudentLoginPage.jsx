import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css";

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

function StudentLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailEmptyError, setEmailEmptyError] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      loginStudent();
    }
  };

  const loginStudent = async () => {
    let hasError = false;

    // clear errors
    setEmailEmptyError(false);
    setEmailFormatError(false);
    setPasswordError(false);

    // Validate Email
    if (!email.trim()) {
      setEmailEmptyError(true);
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailFormatError(true);
      hasError = true;
    }

    // Validate Password
    if (!password.trim()) {
      setPasswordError(true);
      hasError = true;
    }

    // Stop if validation fails
    if (hasError) return;    

    try {
      const res = await fetch("http://localhost:5000/auth/students/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Login successful");
        navigate("/s/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Try again.");
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

        {/* Email Field */}
        <div className="login-field">
          <label className="login-label">Email Address</label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);

              if (!value.trim()) {
                setEmailFormatError(false);
                setEmailEmptyError(false);
              } else {
                setEmailEmptyError(false);

                if (validateEmail(value)) {
                  setEmailFormatError(false);
                }
              }
            }}
            className={`login-input ${
              emailEmptyError || emailFormatError ? "input-error" : ""
            }`}
            onKeyDown={handleEnterKey}
          />
          
          {emailEmptyError && (
            <p className="error-text">Email cannot be empty</p>
          )}
          {emailFormatError && (
            <p className="error-text">Invalid Email Id</p>
          )}
        </div>

        {/* Password Field */}
        <div className="login-field">
          <label className="login-label">Password</label>

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);

              if (passwordError) {
                setPasswordError(false);
              }
            }}
            className={`login-input ${passwordError ? "input-error" : ""}`}
            onFocus={(e) => (e.target.style.borderColor = "var(--foreground)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            onKeyDown={handleEnterKey}
          />

          {passwordError && (
            <p className="error-text">Password cannot be empty</p>
          )}
        </div>

        {/* Login Button */}
        <button onClick={loginStudent} className="login-btn-primary">
          Login
        </button>

        {/* Footer */}
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
