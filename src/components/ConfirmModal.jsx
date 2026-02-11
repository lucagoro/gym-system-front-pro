import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
    if (!isOpen) return null;

    return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        {/* Overlay: Animación de entrada suave */}
        <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={onClose}
        ></div>

        {/* Contenedor: Ajustado para que en tablet no se vea gigante y en mobile respire */}
        <div className="relative bg-slate-900 border border-slate-800 w-full max-w-[380px] md:max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 md:p-10 text-center">
                {/* Icono: Un poco más estilizado */}
                <div className="mx-auto w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 rotate-3 group">
                    <AlertTriangle className="text-red-500" size={40} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
                    {message}
                </p>

                {/* Botones: Stackeados en mobile muy pequeño, lado a lado en tablet/pc */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                        onClick={onClose}
                        className="cursor-pointer flex-1 order-2 sm:order-1 px-6 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all active:scale-95 text-sm"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={onConfirm}
                        disabled={loading}
                        className="cursor-pointer flex-1 order-1 sm:order-2 px-6 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all disabled:opacity-50 shadow-lg shadow-red-600/20 active:scale-95 text-sm flex items-center justify-center"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Eliminar"
                        )}
                    </button>
                </div>
            </div>
        </div>
    </div>
);
};

export default ConfirmModal;