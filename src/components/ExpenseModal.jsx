import { useState } from 'react';
import { X, DollarSign, Tag, FileText, Calendar, ArrowDownCircle } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const ExpenseModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        category: 'SERVICIOS'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Convertimos el monto a número antes de enviarlo
            const dataToSend = {
                ...formData,
                amount: parseFloat(formData.amount) 
            };
            
            await api.post('/expenses', dataToSend);
            toast.success("Gasto registrado");
            onSuccess(); // Esto dispara el fetchFinanceData de la página padre
            onClose();
            // Reset...
        } catch (error) {
            toast.error("Error al guardar");
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
                        <ArrowDownCircle className="text-red-500" /> Nuevo Gasto
                    </h2>
                    <button onClick={onClose} className="cursor-pointer text-slate-400 hover:text-white"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Descripción</label>
                        <div className="relative mt-1">
                            <FileText className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input 
                                type="text" required
                                className="w-full bg-slate-800 border border-slate-700 p-3 pl-10 rounded-xl text-white outline-none focus:ring-2 focus:ring-red-500/50"
                                placeholder="Ej: Alquiler Enero"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Monto</label>
                            <div className="relative mt-1">
                                <DollarSign className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input 
                                    type="number" required
                                    className="w-full bg-slate-800 border border-slate-700 p-3 pl-10 rounded-xl text-white outline-none focus:ring-2 focus:ring-red-500/50"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Fecha</label>
                            <div className="relative mt-1">
                                <Calendar className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input 
                                    type="date" required
                                    className="w-full bg-slate-800 border border-slate-700 p-3 pl-10 rounded-xl text-white outline-none focus:ring-2 focus:ring-red-500/50"
                                    value={formData.expenseDate}
                                    onChange={(e) => setFormData({...formData, expenseDate: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Categoría</label>
                        <select 
                            className="w-full bg-slate-800 border border-slate-700 p-3 mt-1 rounded-xl text-white outline-none focus:ring-2 focus:ring-red-500/50"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            <option value="SERVICIOS">Servicios (Luz, Agua, Gas)</option>
                            <option value="ALQUILER">Alquiler</option>
                            <option value="SUELDOS">Sueldos</option>
                            <option value="MANTENIMIENTO">Mantenimiento</option>
                            <option value="EQUIPAMIENTO">Equipamiento</option>
                            <option value="OTROS">Otros</option>
                        </select>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="cursor-pointer w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-600/20 transition-all mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Registrando...' : 'Registrar Gasto'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ExpenseModal;