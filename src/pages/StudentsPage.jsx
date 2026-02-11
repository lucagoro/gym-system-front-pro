import { useState, useEffect } from 'react';
import api from '../api/axios';
import { getWhatsappLink } from '../utils/whatsapp';
import { UserPlus, Search, Banknote, IdCard, Phone, Calendar, Edit, Trash2, History, MessageCircle} from 'lucide-react';
import { toast } from 'react-toastify';
import StudentModal from '../components/StudentModal';
import ConfirmModal from '../components/ConfirmModal';
import PaymentModal from '../components/PaymentModal';
import StudentsSkeleton from '../components/skeletons/StudentsSkeleton';
import PaymentHistoryModal from '../components/PaymentHistoryModal';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', dni: '', status: 'SIN_PAGOS' });
    const [editingStudent, setEditingStudent] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isConfirmPaymentOpen, setIsConfirmPaymentOpen] = useState(false);
    const [studentToPay, setStudentToPay] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const statusStyles = {
        AL_DIA: "bg-green-500/10 text-green-500 border-green-500/20",
        VENCIDO: "bg-red-500/10 text-red-500 border-red-500/20",
        SIN_PAGOS: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    };

    const handleOpenHistory = (student) => {
        setSelectedStudent(student);
        setIsHistoryOpen(true);
    };

    // 1. Cargar alumnos desde el Backend
    const fetchStudents = async () => {
        try {
            const response = await api.get('/students');
            setStudents(response.data);
        } catch (error) {
            toast.error("No se pudieron cargar los alumnos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // 2. Filtrar alumnos por búsqueda
    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Función para guardar o editar alumno
    const handleSaveStudent = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        try {
            if (editingStudent) {
                // EDITAR
                const response = await api.put(`/students/${editingStudent.id}`, formData);
                setStudents(students.map(s => s.id === editingStudent.id ? response.data : s));
                toast.success("Alumno actualizado");
            } else {
                // CREAR
                const response = await api.post('/students', formData);
                setStudents([...students, response.data]);
                toast.success("Alumno creado");
            }
            closeModal();
        } catch (error) {
            toast.error("Error al guardar");
        } finally {
            setModalLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingStudent(null);
        setFormData({ name: '', phone: '', dni: '', status: 'SIN_PAGOS' });
    }

    // Esta función solo abre el modal
    const openDeleteConfirm = (id) => {
        setStudentToDelete(id);
        setIsConfirmOpen(true);
    };

    // Esta función hace la ejecución real
    const confirmDelete = async () => {
        setDeleteLoading(true);
        try {
            await api.delete(`/students/${studentToDelete}`);
            setStudents(students.filter(s => s.id !== studentToDelete));
            toast.success("Alumno eliminado");
            setIsConfirmOpen(false);
        } catch (error) {
            toast.error("Error al eliminar");
        } finally {
            setDeleteLoading(false);
            setStudentToDelete(null);
        }
    };

    const handleEditClick = (student) => {
        setEditingStudent(student);
        setFormData({ 
            name: student.name,  
            phone: student.phone,
            dni: student.dni,
            status: student.status
        });
        setIsModalOpen(true);
    };

    // Esta función abre el modal de confirmación
    const handlePaymentClick = (student) => {
        setStudentToPay(student);
        setIsConfirmPaymentOpen(true);
    };

    // Esta función ejecuta el cobro real contra el Service de Java
    const confirmPayment = async () => {
        setPaymentLoading(true);
        try {
            // Usamos la ruta que tenés en el Controller
            await api.post(`/students/${studentToPay.id}/payments`); 
            
            toast.success(`¡Pago registrado para ${studentToPay.name}!`);
            setIsConfirmPaymentOpen(false);
            fetchStudents(); // Recargamos la tabla para ver el nuevo vencimiento
        } catch (error) {
            const msg = error.response?.data?.message || "Error al procesar el pago. ¿El alumno tiene un plan asignado?";
            toast.error(msg);
        } finally {
            setPaymentLoading(false);
            setStudentToPay(null);
        }
    };

    const openPaymentModal = (student) => {
        setSelectedStudent(student);
        setIsPaymentModalOpen(true);
    };

    const openNewStudentModal = () => {
        setEditingStudent(null);
        setFormData({ name: '', phone: '', dni: '', status: 'SIN_PAGOS' });
        setIsModalOpen(true);
    };

    return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
        {/* ENCABEZADO Y BUSCADOR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white tracking-tight">Alumnos</h1>
                <p className="text-slate-400 text-sm">Gestioná los socios de tu gimnasio</p>
            </div>
            
            <button 
                onClick={openNewStudentModal}
                className="cursor-pointer flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/25 w-full md:w-auto"
            >
                <UserPlus size={20} />
                Nuevo Alumno
            </button>
        </div>

        {/* BARRA DE BÚSQUEDA */}
        <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input 
                type="text" 
                placeholder="Buscar por nombre o apellido..." 
                className="w-full bg-slate-900 border border-slate-800 p-4 pl-12 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* TABLA / VISTA MÓVIL */}
        {loading ? (
            <div className="animate-in fade-in duration-500">
                <StudentsSkeleton />
            </div>
        ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                
                {/* Versión Escritorio: Tabla */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50 border-b border-slate-800">
                            <tr>
                                <th className="p-5 text-slate-300 font-semibold uppercase text-xs">Alumno</th>
                                <th className="p-5 text-slate-300 font-semibold uppercase text-xs">DNI</th>
                                <th className="p-5 text-slate-300 font-semibold uppercase text-xs">Contacto</th>
                                <th className="p-5 text-slate-300 font-semibold uppercase text-xs">Estado</th>
                                <th className="p-5 text-slate-300 font-semibold uppercase text-xs text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 font-bold">
                                                {student.name.charAt(0)}
                                            </div>
                                            <span className="text-white font-medium">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-slate-500 flex items-center gap-1 text-sm"><IdCard size={14}/> {student.dni}</span>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-slate-500 flex items-center gap-1 text-sm"><Phone size={14}/> {student.phone}</span>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider ${statusStyles[student.status] || statusStyles.SIN_PAGOS}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-center">
                                        <div className="flex justify-center gap-1">
                                            <button onClick={() => handleOpenHistory(student)} className="cursor-pointer p-2 text-slate-400 hover:text-blue-400 transition-colors" title="Ver Historial">
                                                <History size={18} />
                                            </button>
                                            <button onClick={() => openPaymentModal(student)} className="cursor-pointer p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all" title="Cobrar cuota">
                                                <Banknote size={18} />
                                            </button>
                                            <button onClick={() => handleEditClick(student)} className="cursor-pointer p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => openDeleteConfirm(student.id)} className="cursor-pointer p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                            {student.status === "VENCIDO" && (
                                                <a 
                                                    href={getWhatsappLink(student.phone, student.name)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="cursor-pointer p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                                                    title="Enviar aviso por WhatsApp"
                                                >
                                                    <MessageCircle size={18} />
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Versión Móvil: Lista de tarjetas optimizada */}
                <div className="md:hidden divide-y divide-slate-800">
                    {filteredStudents.map((student) => (
                        <div key={student.id} className="p-5 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 font-bold text-lg">
                                        {student.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold">{student.name}</h3>
                                        <p className="text-slate-500 text-xs">DNI: {student.dni || '---'}</p>
                                    </div>
                                </div>
                                {/* ESTADO EN MOBILE (Importante) */}
                                <span className={`px-2 py-1 border rounded-lg text-[9px] font-black uppercase ${statusStyles[student.status] || statusStyles.SIN_PAGOS}`}>
                                    {student.status}
                                </span>
                            </div>

                            <div className="bg-slate-800/40 p-3 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                                    <Phone size={14} className="text-indigo-400" /> {student.phone}
                                </div>
                                {/* ACCIÓN RÁPIDA: HISTORIAL */}
                                <button 
                                    onClick={() => handleOpenHistory(student)}
                                    className="text-blue-400 text-xs flex items-center gap-1 font-bold"
                                >
                                    <History size={14}/> Historial
                                </button>
                            </div>

                            {/* BOTONES DE ACCIÓN PARA CELULAR */}
                            <div className={`grid ${student.status === "VENCIDO" ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
                                <button 
                                    onClick={() => openPaymentModal(student)}
                                    className="flex flex-col items-center justify-center gap-1 bg-emerald-500/10 text-emerald-500 py-3 rounded-2xl border border-emerald-500/20 active:bg-emerald-500/20 transition-all"
                                >
                                    <Banknote size={18} />
                                    <span className="text-[10px] font-bold uppercase">Cobrar</span>
                                </button>
                                <button 
                                    onClick={() => handleEditClick(student)}
                                    className="flex flex-col items-center justify-center gap-1 bg-slate-800 text-slate-300 py-3 rounded-2xl border border-slate-700 active:bg-slate-700 transition-all"
                                >
                                    <Edit size={18} className="text-indigo-400" />
                                    <span className="text-[10px] font-bold uppercase">Editar</span>
                                </button>
                                <button 
                                    onClick={() => openDeleteConfirm(student.id)}
                                    className="flex flex-col items-center justify-center gap-1 bg-red-500/5 text-red-500 py-3 rounded-2xl border border-red-500/10 active:bg-red-500/10 transition-all"
                                >
                                    <Trash2 size={18} />
                                    <span className="text-[10px] font-bold uppercase">Borrar</span>
                                </button>
                                {student.status === "VENCIDO" && (
                                    <a 
                                        href={getWhatsappLink(student.phone, student.name)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center justify-center gap-1 bg-emerald-500/10 text-emerald-500 py-3 rounded-2xl border border-emerald-500/20 active:bg-emerald-500/20 transition-all"
                                    >
                                        <MessageCircle size={18} />
                                        <span className="text-[10px] font-bold uppercase">Avisar</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Mantenemos tus modales igual */}
        <StudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveStudent} formData={formData} setFormData={setFormData} loading={modalLoading} />
        <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={confirmDelete} loading={deleteLoading} title="¿Eliminar alumno?" message="Esta acción no se puede deshacer." />
        <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} student={selectedStudent} onSuccess={fetchStudents} />
        <PaymentHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} student={selectedStudent} />
    </div>
);
};

export default StudentsPage;