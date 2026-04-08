import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css";

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

function RecruiterLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailEmptyError, setEmailEmptyError] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState(false);

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      loginRecruiter();
    }
  };

  const loginRecruiter = async () => {
    let hasError = false;

    // ✅ Reset errors first
    setEmailEmptyError(false);
    setEmailFormatError(false);

    // Validate Email
    if (!email.trim()) {
      setEmailEmptyError(true);
      hasError = true;
    } else if (!validateEmail(email)) {
      // ✅ Only check format if not empty
      setEmailFormatError(true);
      hasError = true;
    }

    if (hasError) return;

    try {
      const res = await fetch("http://localhost:5000/auth/recruiter/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Login successful");
        navigate("/r/dashboard");
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
          <p className="login-eyebrow">Recruiter Portal</p>
          <h1 className="login-title">Request Login Link</h1>
        </div>

        <div className="login-divider" />

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

        <button onClick={loginRecruiter} className="login-btn-primary">
          Login
        </button>
      </div>
    </div>
  );
}

export default RecruiterLoginPage;