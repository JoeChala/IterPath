import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../../css/LoginPage.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function RecruiterVerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying your login link...");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Missing login token.");
      setStatus("");
      return;
    }

    const verifyRecruiter = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/auth/recruiter/verify?token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || data.message || "Invalid login link");
        }

        setStatus("Login verified. Redirecting...");
        navigate(data.redirectTo || "/r/dashboard", { replace: true });
      } catch (err) {
        setError(err.message);
        setStatus("");
      }
    };

    verifyRecruiter();
  }, [navigate, searchParams]);

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <p className="login-eyebrow">Recruiter Portal</p>
          <h1 className="login-title">Magic Link</h1>
        </div>

        <div className="login-divider" />

        {status && <p className="login-footer-text">{status}</p>}

        {error && (
          <div className="login-field">
            <p className="error-text">{error}</p>
            <Link to="/r/login" className="login-btn-primary">
              Request a new link
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruiterVerifyPage;
