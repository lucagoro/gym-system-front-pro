import './App.css'
import StudentsPage from './StudentsPage'
import StudentDetailPage from "./StudentDetailPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './components/Dashboard';
import Header from "./components/Header";
import BottomNav from './components/BottomNav';
import AddStudentPage from './AddStudentPage';
import EditStudentPage from './EditStudentPage';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/:id" element={<StudentDetailPage />} />
        <Route path="/students/add" element={<AddStudentPage />} />
        <Route path="/students/:id/edit" element={<EditStudentPage />} />
      </Routes>
      <BottomNav/>
    </BrowserRouter>
  );
}

export default App
