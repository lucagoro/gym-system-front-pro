import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout';
import StudentsPage from './pages/StudentsPage';
import Dashboard from './pages/Dashboard';
import FinancePage from './pages/FinancePage';
import PlansPage from './pages/PlansPage';
import { useState, useEffect } from 'react';

function App() {

  // Usamos un estado para el rol. Se inicializa con lo que haya en sessionStorage.
  const [role, setRole] = useState(sessionStorage.getItem('role'));

  // Este efecto es para que, si el sessionStorage cambia, el componente se entere
  // (Opcional, pero ayuda en algunos casos)
  useEffect(() => {
    const currentRole = sessionStorage.getItem('role');
    setRole(currentRole);
  }, []);

  const token = sessionStorage.getItem('token');

  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN';
  const isGuest = role === 'GUEST' || role === 'ROLE_GUEST';

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          {/* Ahora las rutas dependen de la variable 'role' del estado */}
          <Route 
            path="/dashboard" 
            element={isAdmin || isGuest ? <Dashboard /> : <Navigate to="/students" replace />} 
          />
          
          <Route path="/students" element={<StudentsPage />} />
          
          <Route 
            path="/finances" 
            element={isAdmin || isGuest ? <FinancePage /> : <Navigate to="/students" replace />} 
          />

          <Route 
            path="/plans" element={<PlansPage />} />
        </Route>

        <Route path="*" element={<Navigate to={token ? (isAdmin || isGuest ? "/dashboard" : "/students") : "/login"} replace />} />
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </Router>
  );
}

export default App;