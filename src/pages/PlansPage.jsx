import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Pencil, Trash2, Clock, DollarSign, Settings, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import PlanModal from '../components/PlanModal';
import ConfirmModal from '../components/ConfirmModal';
import PlansSkeleton from '../components/skeletons/PlansSkeleton';

const PlansPage = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [planToDelete, setPlanToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await api.get('/plans'); // Tu endpoint de PlanController
            setPlans(response.data);
        } catch (error) {
            toast.error("Error al cargar los planes");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const openDeleteConfirm = (id) => {
        setPlanToDelete(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/plans/${planToDelete}`);
            toast.success("Plan eliminado correctamente");
            fetchPlans();
            setIsConfirmOpen(false);
        } catch (error) {
            toast.error("No se puede eliminar un plan que está siendo usado");
        }
    };

    return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 md:pb-10">
        {/* HEADER: Ajustado para que en 768px no se amontone */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Membresías</h1>
                <p className="text-slate-400 text-sm md:text-base">Gestiona los planes y sus costos</p>
            </div>
            <button 
                onClick={() => { setSelectedPlan(null); setIsModalOpen(true); }}
                className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 w-full sm:w-auto active:scale-95 text-sm"
            >
                <Plus size={18} /> Crear Plan
            </button>
        </header>

        {loading ? (
            <PlansSkeleton />
        ) : (
            /* GRID: En 768px (md) usamos 2 columnas pero con gap reducido para que no se apriete */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {plans.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[2rem]">
                        <Tag className="mx-auto text-slate-700 mb-4" size={48} />
                        <p className="text-slate-500">No hay planes configurados.</p>
                    </div>
                ) : (
                    plans.map((plan) => (
                        <div key={plan.id} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] hover:border-indigo-500/30 transition-all shadow-xl flex flex-col h-full">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-white uppercase tracking-tight line-clamp-1">{plan.name}</h3>
                                    <div className="bg-indigo-500/10 p-2 rounded-xl shrink-0">
                                        <Tag size={16} className="text-indigo-400" />
                                    </div>
                                </div>

                                <div className="flex items-baseline gap-1 text-indigo-400 mb-6">
                                    <span className="text-base font-bold">$</span>
                                    <span className="text-3xl font-black">
                                        {new Intl.NumberFormat('es-AR').format(plan.price)}
                                    </span>
                                    <span className="text-slate-500 text-[10px] font-bold ml-1 uppercase">/ mes</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-slate-300 bg-slate-800/40 w-fit px-3 py-1.5 rounded-xl text-[10px] font-bold mb-6 border border-slate-700/30">
                                    <Clock size={14} className="text-indigo-400" /> 
                                    <span>{plan.durationDays} días</span>
                                </div>
                            </div>

                            {/* BOTONES: Max-width para que no se vean gigantes en tablets/pc */}
                            <div className="flex justify-between gap-2 pt-4 border-t border-slate-800/50">
                                <button 
                                    onClick={() => handleEdit(plan)}
                                    className="cursor-pointer flex-1 max-w-[150px] bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-slate-700 active:scale-[0.98] text-xs"
                                >
                                    <Pencil size={14} className="text-indigo-400" /> 
                                    Editar
                                </button>
                                <button 
                                    onClick={() => openDeleteConfirm(plan.id)}
                                    className="cursor-pointer p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 active:scale-90"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}
        {/* MODALES */}
        <PlanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchPlans} planToEdit={selectedPlan} />
        <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={confirmDelete} title="¿Eliminar este plan?" message="Ten en cuenta que si hay alumnos usando este plan podrías tener problemas en los reportes de ingresos." loading={deleteLoading} />
    </div>
);
};

export default PlansPage;