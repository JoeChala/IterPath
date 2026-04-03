import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentLoginPage from "./pages/StudentLoginPage";
import StudentRegisterPage from "./pages/StudentRegisterPage";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import StudentPostingPage from "./pages/StudentJobDetailsPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentLoginPage />} />
        <Route path="/register" element={<StudentRegisterPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/dashboard/posting/:id" element={<StudentPostingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
