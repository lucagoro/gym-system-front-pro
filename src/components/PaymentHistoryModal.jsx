import React, { useState, useEffect } from 'react';
import { X, Calendar, CreditCard, DollarSign, Tag } from 'lucide-react';
import api from '../api/axios';

const PaymentHistoryModal = ({ isOpen, onClose, student }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && student?.id) {
            setLoading(true);
            api.get(`/students/${student.id}/payments`)
                .then(res => setPayments(res.data))
                .catch(() => console.error("Error al traer pagos"))
                .finally(() => setLoading(false));
        }
    }, [isOpen, student]);

    if (!isOpen) return null;

   return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Overlay con blur */}
        <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={onClose}
        ></div>

        {/* Contenedor: rounded-[2.5rem] para machar con el resto de la UI */}
        <div className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header: Más estilizado */}
            <div className="p-6 md:p-8 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/50">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Historial de Pagos</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                        <p className="text-sm text-slate-400 font-medium">
                            {student?.name} {student?.surname}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={onClose} 
                    className="cursor-pointer p-3 hover:bg-slate-800 rounded-2xl text-slate-400 transition-all active:scale-90"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Contenido: Altura controlada y scrollbar estética */}
            <div className="p-4 md:p-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium animate-pulse">Cargando historial...</p>
                    </div>
                ) : payments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-[10px] uppercase text-slate-500 tracking-[0.2em] font-black">
                                    <th className="px-4 py-2">Fecha</th>
                                    <th className="px-4 py-2">Plan</th>
                                    <th className="px-4 py-2 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p) => (
                                    <tr key={p.id} className="group transition-all">
                                        <td className="px-4 py-4 text-slate-300 text-sm bg-slate-800/30 rounded-l-2xl border-y border-l border-slate-800/50">
                                            {p.paymentDate}
                                        </td>
                                        <td className="px-4 py-4 bg-slate-800/30 border-y border-slate-800/50">
                                            <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-indigo-500/20">
                                                {p.planName}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-emerald-400 font-bold text-right bg-slate-800/30 rounded-r-2xl border-y border-r border-slate-800/50">
                                            ${new Intl.NumberFormat('es-AR').format(p.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/20 rounded-[2rem] border-2 border-dashed border-slate-800">
                        <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                            <Tag size={32} />
                        </div>
                        <p className="text-slate-500 font-medium">No hay pagos registrados para este alumno.</p>
                    </div>
                )}
            </div>

            {/* Footer decorativo o acción de cierre extra para mobile */}
            <div className="p-4 bg-slate-900/80 border-t border-slate-800/50 flex justify-center md:hidden">
                <button 
                    onClick={onClose}
                    className="w-full py-4 bg-slate-800 text-slate-300 font-bold rounded-2xl active:scale-95 transition-all"
                >
                    Cerrar
                </button>
            </div>
        </div>
    </div>
);
};

export default PaymentHistoryModal;