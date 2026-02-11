import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout';
import StudentsPage from './pages/StudentsPage';
import Dashboard from './pages/Dashboard';
import FinancePage from './pages/FinancePage';
import PlansPage from './pages/PlansPage';
import PaymentPage from './pages/PaymentPage';
import { useState, useEffect } from 'react';

function App() {

  // Usamos un estado para el rol. Se inicializa con lo que haya en el storage.
  const [role, setRole] = useState(localStorage.getItem('role'));

  // Este efecto es para que, si el localStorage cambia, el componente se entere
  // (Opcional, pero ayuda en algunos casos)
  useEffect(() => {
    const currentRole = localStorage.getItem('role');
    setRole(currentRole);
  }, []);

  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN';

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          {/* Ahora las rutas dependen de la variable 'role' del estado */}
          <Route 
            path="/dashboard" 
            element={isAdmin ? <Dashboard /> : <Navigate to="/students" replace />} 
          />
          
          <Route path="/students" element={<StudentsPage />} />
          
          <Route 
            path="/finances" 
            element={isAdmin ? <FinancePage /> : <Navigate to="/students" replace />} 
          />

          <Route 
            path="/plans" element={<PlansPage />} />
        </Route>

        <Route path="*" element={<Navigate to={isAdmin ? "/dashboard" : "/students"} replace />} />
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </Router>
  );
}

export default App;