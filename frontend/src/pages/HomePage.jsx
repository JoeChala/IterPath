import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Logo / Title */}
        <div className="home-header">
          <h1 className="home-title">IterPath</h1>
          <p className="home-subtitle">Your Gateway to Placements</p>
        </div>

        {/* Role Selection */}
        <div className="home-cards">
          {/* Recruiter */}
          <div
            className="home-card"
            onClick={() => navigate("/r/login")}
          >
            <h2>Recruiter Login</h2>
            <p>Post job openings and review applications.</p>

            <button className="home-btn">Continue →</button>
          </div>

          {/* Student */}
          <div className="home-card" onClick={() => navigate("/s/login")}>
            <h2>Student Login</h2>
            <p>Browse placements and apply for opportunities.</p>
            <button className="home-btn">Continue →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
