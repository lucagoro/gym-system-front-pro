import { X, User, IdCard, Mail, Phone, Calendar } from 'lucide-react';

const StudentModal = ({ isOpen, onClose, onSubmit, formData, setFormData, loading, editingStudent }) => {
    if (!isOpen) return null;

    return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Overlay - Mantenemos tu color y blur */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>

        {/* Contenedor del Modal - Mantenemos max-w-lg y rounded-3xl */}
        <div className="relative bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Cabecera - Mantenemos bg-slate-800/30 */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="text-indigo-500" /> 
                    {editingStudent ? 'Editar Alumno' : 'Nuevo Alumno'}
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                    <X size={24} />
                </button>
            </div>

            {/* Formulario - Mantenemos space-y-4 y p-6 */}
            <form onSubmit={onSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    
                    {/* Nombre Completo - Ocupa todo el ancho siempre */}
                    <div>
                        <label className="text-sm font-medium text-slate-400 mb-1.5 block ml-1">Nombre Completo</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="text" required
                                className="w-full bg-slate-800 border border-slate-700 p-3 pl-10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="Juan González"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* DNI y Teléfono - En Tablet/PC van juntos (grid-cols-2), en Celu uno abajo del otro */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-400 mb-1.5 block ml-1">DNI</label>
                            <div className="relative">
                                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="text" required
                                    className="w-full bg-slate-800 border border-slate-700 p-3 pl-10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="12345678"
                                    value={formData.dni}
                                    onChange={(e) => setFormData({...formData, dni: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-400 mb-1.5 block ml-1">Teléfono</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="text"
                                    className="w-full bg-slate-800 border border-slate-700 p-3 pl-10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="11 2233-4455"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botones de acción - sm:flex-row para que en celu se apilen y sea más fácil tocar */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="order-2 sm:order-1 flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-all cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="order-1 sm:order-2 flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Guardando..." : "Guardar Alumno"}
                    </button>
                </div>
            </form>
        </div>
    </div>
);
};

export default StudentModal;