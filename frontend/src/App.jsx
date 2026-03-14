import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentLoginPage from "./pages/StudentLoginPage";
import StudentRegisterPage from "./pages/StudentRegisterPage";
import StudentDashboard from "./components/StudentDashboard/StudentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentLoginPage />} />
        <Route path="/register" element={<StudentRegisterPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;