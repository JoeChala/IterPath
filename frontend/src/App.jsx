import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";

import StudentLoginPage from "./pages/StudentLoginPage";
import StudentRegisterPage from "./pages/StudentRegisterPage";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import StudentPostingPage from "./pages/StudentJobDetailsPage.jsx";
import RecruiterLoginPage from "./pages/RecruiterLoginPage.jsx";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;
