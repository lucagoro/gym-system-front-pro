import { useState, useEffect } from 'react';
import { X, Tag, DollarSign, Calendar, Save } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const PlanModal = ({ isOpen, onClose, onSuccess, planToEdit }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        durationDays: 30
    });

    // Si vamos a editar, cargamos los datos del plan
    useEffect(() => {
        if (planToEdit) {
            setFormData({
                name: planToEdit.name,
                price: planToEdit.price,
                durationDays: planToEdit.durationDays
            });
        } else {
            setFormData({ name: '', price: '', durationDays: 30 });
        }
    }, [planToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (planToEdit) {
                // UPDATE
                await api.put(`/plans/${planToEdit.id}`, formData);
                toast.success("Plan actualizado");
            } else {
                // CREATE
                await api.post('/plans', formData);
                toast.success("Nuevo plan creado");
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Error al procesar el plan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Tag className="text-indigo-500" /> {planToEdit ? 'Editar Plan' : 'Nuevo Plan'}
                    </h2>
                    <button onClick={onClose} className="cursor-pointer text-slate-400 hover:text-white"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Nombre del Plan</label>
                        <input 
                            type="text" required
                            className="w-full bg-slate-800 border border-slate-700 p-3 mt-1 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                            placeholder="Ej: Pase Libre Musculación"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Precio ($)</label>
                            <div className="relative mt-1">
                                <DollarSign className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input 
                                    type="number" required
                                    className="w-full bg-slate-800 border border-slate-700 p-3 pl-10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Duración (Días)</label>
                            <div className="relative mt-1">
                                <Calendar className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input 
                                    type="number" required
                                    className="w-full bg-slate-800 border border-slate-700 p-3 pl-10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    value={formData.durationDays}
                                    onChange={(e) => setFormData({...formData, durationDays: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-500 italic px-1">
                        * Al cobrar este plan, el vencimiento del alumno se extenderá automáticamente por los días indicados.
                    </p>

                    <button 
                        type="submit" disabled={loading}
                        className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all mt-4 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Guardando...' : <><Save size={20} /> Guardar Plan</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PlanModal;