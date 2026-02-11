import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/authService';
import { Dumbbell } from 'lucide-react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Creamos un ID de toast para que no se dupliquen
        const toastId = toast.loading("Verificando credenciales...");

        try {
            await login(username, password);
            // Actualizamos el toast a éxito
            toast.update(toastId, { 
                render: "¡Bienvenido de nuevo!", 
                type: "success", 
                isLoading: false, 
                autoClose: 2000 
            });
            // Redirigimos al Dashboard después de un breve delay
            setTimeout(() => {
                navigate('/dashboard'); 
            }, 1000);
        } catch (error) {
            // Actualizamos el toast a error
            toast.update(toastId, { 
                render: error.response?.data?.message || "Error de conexión", 
                type: "error", 
                isLoading: false, 
                autoClose: 3000 
            });        
        }
    };

    return (
        // Fondo principal oscuro profundo
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            
            {/* Tarjeta con borde sutil y efecto glassmorphism */}
            <form onSubmit={handleSubmit} 
                  className="bg-slate-900 border border-slate-800 p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md transition-all">
                
                <div className="flex justify-center mb-6">
                    <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20">
                        <Dumbbell className="h-8 w-8 text-indigo-400" />
                    </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-white mb-2">
                    Iron City <span className="text-indigo-500">Gym</span>
                </h2>
                <p className="text-center text-slate-400 mb-8 text-sm sm:text-base">
                    Ingresá al panel de control
                </p>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Usuario</label>
                        <input 
                            type="text" 
                            placeholder="Usuario" 
                            className="w-full p-3 sm:p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Contraseña</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full p-3 sm:p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 sm:py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all mt-4 cursor-pointer">
                        Entrar
                    </button>
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">
                        Gestión Profesional para tu Gimnasio
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;