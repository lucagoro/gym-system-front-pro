import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, UserCheck, UserMinus, CreditCard, DollarSign, TrendingUp, Activity, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import MonthlyChart from '../components/MonthlyChart';

const Dashboard = () => {
    const [summary, setSummary] = useState({
        total: 0,
        alDia: 0,
        vencidos: 0,
        sinPagos: 0,
        totalMes: 0,
        chartData: [] // Inicializamos el estado para los datos del gráfico
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Conectamos con tu endpoint de Spring Boot
                const response = await api.get('/students/summary'); 
                setSummary({...response.data,
                        chartData: response.data.chartData || []
                });
            } catch (error) {
                console.error(error);
                toast.error("Error al sincronizar con el servidor");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Configuración de las tarjetas de estado
    const statusCards = [
        { title: 'Total Alumnos', value: summary.total, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { title: 'Al día', value: summary.alDia, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { title: 'Vencidos', value: summary.vencidos, icon: UserMinus, color: 'text-red-400', bg: 'bg-red-400/10' },
        { title: 'Sin Pagos', value: summary.sinPagos, icon: CreditCard, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    ];

    return (
    <div className="space-y-6 md:space-y-8 pb-10"> {/* Añadí padding inferior para mobile */}
        
        {/* CABECERA: En mobile se apila (col), en desktop se alinea (row) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight text-center md:text-left">
                    Panel de Control
                </h1>
                <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2 text-sm">
                    <Calendar size={16} className="text-indigo-400" /> 
                    Resumen del mes actual
                </p>
            </div>
            
            {/* TARJETA DE RECAUDACIÓN: Optimizada para no ocupar tanto alto en mobile */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-5 rounded-3xl shadow-lg shadow-indigo-500/20 flex items-center gap-4 w-full md:w-auto md:min-w-[280px]">
                <div className="bg-white/20 p-3 rounded-2xl shrink-0">
                    <DollarSign className="text-white" size={24} />
                </div>
                <div>
                    <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest opacity-80">Recaudación Mes</p>
                    <p className="text-2xl font-black text-white leading-tight">
                        ${new Intl.NumberFormat('es-AR').format(summary.totalMes || 0)}
                    </p>
                </div>
            </div>
        </div>

        {loading ? (
            <DashboardSkeleton />
        ) : (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* GRID DE ESTADOS: 1 col en mobile, 2 en tablet, 4 en desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {statusCards.map((card, index) => (
                        <div key={index} className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-3xl hover:border-slate-700 transition-all shadow-xl group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${card.bg} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                                    <card.icon className={card.color} size={22} />
                                </div>
                                <Activity className="text-slate-700" size={16} />
                            </div>
                            <h3 className="text-slate-400 font-medium text-xs md:text-sm">{card.title}</h3>
                            <p className="text-2xl md:text-3xl font-bold text-white mt-1">{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* SECCIÓN DE GRÁFICOS Y ACTIVIDAD */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Gráfico: Ocupa 2 columnas en desktop, 1 en mobile */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 md:p-8 rounded-3xl min-h-[300px] md:min-h-[400px] flex flex-col relative overflow-hidden">
                        <div className="mb-6">
                            <h3 className="text-white font-bold text-lg">Registros Mensuales</h3>
                            <p className="text-slate-500 text-xs md:text-sm font-medium">Crecimiento de socios en el tiempo</p>
                        </div>

                        {/* Contenedor del gráfico con scroll horizontal solo si es MUY necesario */}
                        <div className="flex-1 w-full overflow-hidden">
                            <MonthlyChart data={summary.chartData} />
                        </div>
                    </div>

                    {/* Alertas del Sistema: Ocupa 1 columna */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            Alertas del Sistema
                            <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                        </h3>
                        
                        <div className="space-y-5">
                            {summary.vencidos > 0 && (
                                <div className="flex gap-4 p-3 rounded-2xl bg-red-500/5 border border-red-500/10">
                                    <div className="h-2 w-2 mt-2 shrink-0 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                    <div>
                                        <p className="text-red-200 text-sm font-bold tracking-tight">Atención necesaria</p>
                                        <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                                            Hay <span className="text-red-400 font-bold">{summary.vencidos} alumnos</span> con pagos vencidos.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                <div className="h-2 w-2 mt-2 shrink-0 rounded-full bg-emerald-500"></div>
                                <div>
                                    <p className="text-emerald-200 text-sm font-bold tracking-tight">Sistema al día</p>
                                    <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">Sincronización con el servidor exitosa.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default Dashboard;