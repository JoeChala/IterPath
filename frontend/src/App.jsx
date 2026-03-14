import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentLoginPage from "./pages/StudentLoginPage";
import StudentRegisterForm from "./components/StudentRegisterForm";
import StudentDashboard from "./components/StudentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentLoginPage />} />
        <Route path="/auth/students/login" element={<StudentLoginPage />} />
        <Route path="/register" element={<StudentRegisterForm />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;