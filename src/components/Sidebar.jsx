import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, Dumbbell, Menu, X, DollarSign } from 'lucide-react';
import { logout } from '../services/authService';
import { useState } from 'react';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false); // Estado para el menú móvil
    const navigate = useNavigate();
    const location = useLocation();

    // Recuperamos la info del LocalStorage
    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('username');

    const isAdmin = userRole === 'ADMIN' || userRole === 'ROLE_ADMIN';
    const isGuest = userRole === 'GUEST' || userRole === 'ROLE_GUEST';

    const menuItems = [
        ...(isAdmin || isGuest ? [{ path: '/', label: 'Dashboard', icon: LayoutDashboard }] : []),
        { icon: Users, label: 'Alumnos', path: '/students' },
        ...(isAdmin || isGuest ? [{ icon: DollarSign, label: 'Finanzas', path: '/finances' }] : []),
        { icon: Settings, label: 'Planes', path: '/plans' },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* BOTÓN HAMBURGUESA (Solo visible en móviles) */}
            <button 
                onClick={toggleMenu}
                className="md:hidden fixed top-5 left-5 z-[60] p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 active:scale-90 transition-all"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* OVERLAY (Capa oscura cuando el menú está abierto en móvil) */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={toggleMenu}
                ></div>
            )}

            {/* SIDEBAR */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 transform
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 md:sticky md:top-0 
                flex flex-col h-screen
            `}>
                <div className="p-6 pl-18 md:pl-6 flex items-center gap-3">
                    <Dumbbell className="text-indigo-500 h-8 w-8" />
                    <span className="text-xl font-bold text-white">IronCity</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)} // Cierra el menú al hacer clic
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                location.pathname === item.path 
                                ? 'bg-indigo-600 text-white' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* SECCIÓN DE USUARIO Y CIERRE (Abajo del todo) */}
            <div className="p-4 border-t border-slate-800 space-y-4">
                
                    {/* INFO DEL USUARIO LOGUEADO */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg">
                            {userName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-white truncate">
                                {userName || 'Usuario'}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-extrabold">
                                {userRole === 'ROLE_ADMIN' || userRole === 'ADMIN' ? 'Administrador' : 'Staff'}
                            </span>
                        </div>
                    </div>

                    {/* BOTÓN CERRAR SESIÓN */}
                    <button 
                        onClick={() => logout()}
                        className="cursor-pointer flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all duration-200 group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;