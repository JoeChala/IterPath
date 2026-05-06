import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";

import StudentLoginPage from "./pages/student/StudentLoginPage";
import StudentRegisterPage from "./pages/student/StudentRegisterPage";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import StudentPostingPage from "./pages/student/StudentJobDetailsPage.jsx";
import RecruiterLoginPage from "./pages/recruiter/RecruiterLoginPage.jsx";
import RecruiterVerifyPage from "./pages/recruiter/RecruiterVerifyPage.jsx";
import RecruiterOnboarding from "./pages/recruiter/RecruiterOnboarding.jsx";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard.jsx";
// Frontend route guards removed — backend enforces auth/roles

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Student Routes */}
        <Route path="/s/login" element={<StudentLoginPage />} />

        <Route path="/s/register" element={<StudentRegisterPage />} />

        <Route path="/s/dashboard" element={<StudentDashboard />} />

        <Route path="/s/dashboard/posting/:id" element={<StudentPostingPage />} />
        {/* Recruiter Routes */}
        <Route path="/r/login" element={<RecruiterLoginPage />} />
        <Route path="/r/verify" element={<RecruiterVerifyPage />} />
        <Route path="/r/onboarding" element={<RecruiterOnboarding />} />
        <Route path="/r/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/onboarding" element={<RecruiterOnboarding />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
