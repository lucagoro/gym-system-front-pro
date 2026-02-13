import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
    const token = sessionStorage.getItem('token');

    // Si no hay token, lo mandamos al login (Ruta Protegida)
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200">
            <Sidebar />
            <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 overflow-y-auto w-full">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;