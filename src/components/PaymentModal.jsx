import { useState, useEffect } from 'react';
import { X, Banknote, CheckCircle, Calendar, CreditCard } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const PaymentModal = ({ isOpen, onClose, student, onSuccess }) => {
    const [planes, setPlanes] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Mantenemos el formData que te gusta, asegurando que coincida con el DTO
    const [formData, setFormData] = useState({
        planId: '',
        amount: 0,
        method: 'CASH',
        paymentDate: new Date().toISOString().split('T')[0] // Fecha actual por defecto
    });

    useEffect(() => {
        if (isOpen) {
            fetchPlanes();
            // Resetear form al abrir
            setFormData({ planId: '', amount: 0, method: 'CASH', paymentDate: new Date().toISOString().split('T')[0] });
        }
    }, [isOpen]);

    const fetchPlanes = async () => {
        try {
            const res = await api.get('/plans');
            setPlanes(res.data);
            
            // Si el alumno ya tiene un plan en el objeto student, podrías pre-cargarlo:
            if (student?.plan) {
                setFormData(prev => ({
                    ...prev,
                    planId: student.plan.id,
                    amount: student.plan.price
                }));
            }
        } catch (error) {
            toast.error("Error al cargar planes");
        }
    };

    const handlePlanChange = (e) => {
        const id = e.target.value;
        const selectedPlan = planes.find(p => p.id === parseInt(id));
        
        if (selectedPlan) {
            setFormData({
                ...formData,
                planId: selectedPlan.id,
                amount: selectedPlan.price
            });
        } else {
            setFormData({ ...formData, planId: '', amount: 0 });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.planId) return toast.warning("Por favor, seleccioná un plan");
        
        setLoading(true);
        try {
            // El endpoint debe coincidir con tu @PostMapping en el Controller
            // Enviamos el formData que contiene el planId elegido
            await api.post(`/students/${student.id}/payments`, formData);
            
            toast.success("¡Pago registrado correctamente!");
            onSuccess(); // Refresca la tabla de alumnos
            onClose();
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error al procesar el pago";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !student) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-emerald-500/5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Banknote className="text-emerald-500" /> Registrar Cobro
                    </h2>
                    <button onClick={onClose} className="cursor-pointer text-slate-400 hover:text-white transition-colors"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Alumno</p>
                        <p className="text-white font-bold text-lg">{student.name}</p>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Plan a contratar</label>
                        <select 
                            required
                            className="w-full bg-slate-800 border border-slate-700 p-3 mt-1 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                            value={formData.planId}
                            onChange={handlePlanChange}
                        >
                            <option value="">-- Seleccionar Plan --</option>
                            {planes.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Fecha</label>
                        <div className="relative mt-1">
                            <Calendar className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input 
                                type="date" required
                                className="w-full bg-slate-800 border border-slate-700 p-3 pl-10 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500/50 "
                                value={formData.paymentDate} // Fecha actual por defecto
                                onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Monto ($)</label>
                            <div className="relative">
                                <input 
                                    type="number" readOnly
                                    className="w-full bg-slate-950 border border-slate-800 p-3 mt-1 rounded-xl text-emerald-400 font-bold outline-none cursor-default"
                                    value={formData.amount}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Método</label>
                            <select 
                                className="w-full bg-slate-800 border border-slate-700 p-3 mt-1 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500/50"
                                value={formData.method}
                                onChange={(e) => setFormData({...formData, method: e.target.value})}
                            >
                                <option value="CASH">Efectivo</option>
                                <option value="TRANSFER">Transferencia</option>
                                <option value="DEBIT_CARD">Débito / Crédito</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" disabled={loading}
                            className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Procesando...
                                </span>
                            ) : (
                                <><CheckCircle size={20} className="group-hover:scale-110 transition-transform" /> Confirmar Pago</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;