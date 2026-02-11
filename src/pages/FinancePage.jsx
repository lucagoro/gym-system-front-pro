import { useState, useEffect } from 'react';
import api from '../api/axios';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Wallet, Plus, Trash2, Calendar, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import ExpenseModal from '../components/ExpenseModal';
import ConfirmModal from '../components/ConfirmModal';
import FinanceSkeleton from '../components/skeletons/FinanceSkeleton';  

const FinancePage = () => {
    const [financeData, setFinanceData] = useState({ totalIncomes: 0, totalExpenses: 0, netProfit: 0 });
    const [expensesList, setExpensesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('gastos');
    const [incomeList, setIncomeList] = useState([]);
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(firstDay); // Primero del mes
    const [endDate, setEndDate] = useState(lastDay);   // Último del mes
    const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 });

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const fetchFinanceData = async () => {
    try {
        setLoading(true);
        const [resBalance, resExpenses, resIncomes] = await Promise.all([
            api.get(`/finance/balance?start=${startDate}&end=${endDate}`),
            api.get(`/expenses?startDate=${startDate}&endDate=${endDate}`),
            api.get(`/payments/report?startDate=${startDate}&endDate=${endDate}`)
        ]);
        setFinanceData(resBalance.data);
        setExpensesList(resExpenses.data);
        setIncomeList(resIncomes.data); 
    } catch (error) {
        console.error(error);
        toast.error("Error al sincronizar datos financieros");
    } finally {
        setLoading(false);
    }
};

    const openDeleteConfirm = (id) => {
        setExpenseToDelete(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        setDeleteLoading(true);
        try {
            await api.delete(`/expenses/${expenseToDelete}`);
            toast.success("Gasto eliminado");
            await fetchFinanceData(); // Esto actualiza los totales de arriba
            setIsConfirmOpen(false);
        } catch (error) {
            toast.error("Error al eliminar");
        } finally {
            setDeleteLoading(false);
            setExpenseToDelete(null);
        }
    };

    return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-10">
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white tracking-tight">Finanzas</h1>
                <p className="text-slate-400 text-sm md:text-base">Control de ingresos, gastos y balance neto</p>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 md:px-8 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 w-full md:w-fit active:scale-95"
            >
                <Plus size={20} /> Nuevo Gasto
            </button>
        </header>

        {loading ? (
            <FinanceSkeleton />
        ) : (
            <>
                {/* FINANCE STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* INGRESOS */}
                    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Ingresos (Cuotas)</p>
                            <p className="text-2xl xl:text-3xl font-black text-emerald-500 mt-2">
                                + ${new Intl.NumberFormat('es-AR').format(financeData.totalIncomes)}
                            </p>
                        </div>
                        <ArrowUpCircle className="absolute -right-4 -bottom-4 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors" size={100} />
                    </div>

                    {/* GASTOS */}
                    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Gastos Operativos</p>
                            <p className="text-2xl xl:text-3xl font-black text-red-500 mt-2">
                                - ${new Intl.NumberFormat('es-AR').format(financeData.totalExpenses)}
                            </p>
                        </div>
                        <ArrowDownCircle className="absolute -right-4 -bottom-4 text-red-500/5 group-hover:text-red-500/10 transition-colors" size={100} />
                    </div>

                    <div className="bg-slate-900 p-6 rounded-3xl border-2 border-indigo-500/20 shadow-xl relative overflow-hidden group md:col-span-2 lg:col-span-1">
                        <div className="relative z-10">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Balance Neto</p>
                            <p className={`text-2xl xl:text-3xl font-black mt-2 ${financeData.netProfit >= 0 ? 'text-white' : 'text-red-400'}`}>
                                {financeData.netProfit >= 0 ? '$' + new Intl.NumberFormat('es-AR').format(financeData.netProfit) : '- $' + new Intl.NumberFormat('es-AR').format(Math.abs(financeData.netProfit))}
                            </p>
                        </div>
                        <Wallet className="absolute -right-4 -bottom-4 text-indigo-500/5 group-hover:text-indigo-500/10 transition-colors" size={100} />
                    </div>
                </div>

                {/* TABS SELECTOR */}
                <div className="flex gap-6 border-b border-slate-800 overflow-x-auto no-scrollbar">
                    <button 
                        onClick={() => setActiveTab('gastos')}
                        className={`cursor-pointer pb-4 px-1 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'gastos' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Lista de Gastos
                    </button>
                    <button 
                        onClick={() => setActiveTab('ingresos')}
                        className={`cursor-pointer pb-4 px-1 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'ingresos' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Historial de Pagos
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:items-end gap-3 bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl">
                                <div className="space-y-2">
                                    <p className="text-slate-500 text-[10px] font-black uppercase ml-1">Desde</p>
                                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-800 text-white text-sm p-2.5 rounded-xl border border-slate-700 outline-none focus:border-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-slate-500 text-[10px] font-black uppercase ml-1">Hasta</p>
                                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-800 text-white text-sm p-2.5 rounded-xl border border-slate-700 outline-none focus:border-indigo-500" />
                                </div>
                                <button onClick={fetchFinanceData} className="col-span-2 md:col-span-1 h-[42px] mt-auto cursor-pointer bg-indigo-600 text-white px-5 rounded-xl transition-all flex items-center justify-center gap-2 font-bold shadow-lg shadow-indigo-500/20 active:scale-95">
                                    <Search size={18} /> <span className="hidden md:inline">Filtrar</span>
                                </button>
                            </div>

                {/* CONTENIDO DINÁMICO */}
                <div className="space-y-4">
                    {activeTab === 'gastos' ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                            {/* Desktop & Tablet: Ahora la tabla no se rompe en 768px */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead className="bg-slate-800/50 border-b border-slate-800">
                                        <tr>
                                            <th className="p-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Fecha</th>
                                            <th className="p-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Descripción</th>
                                            <th className="p-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Categoría</th>
                                            <th className="p-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Monto</th>
                                            <th className="p-4 text-slate-400 font-bold text-xs uppercase tracking-widest text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {expensesList.map((exp) => (
                                            <tr key={exp.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="p-4 text-slate-300 text-sm whitespace-nowrap">{exp.expenseDate}</td>
                                                <td className="p-4 text-white font-medium">{exp.description}</td>
                                                <td className="p-4">
                                                    <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded-lg text-[10px] font-bold border border-slate-700 uppercase">
                                                        {exp.category}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-red-400 font-bold whitespace-nowrap">-{formatter.format(exp.amount)}</td>
                                                <td className="p-4 text-center">
                                                    <button onClick={() => openDeleteConfirm(exp.id)} className="cursor-pointer text-slate-500 hover:text-red-500 p-2 transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Mobile */}
                            <div className="md:hidden divide-y divide-slate-800">
                                {expensesList.map((exp) => (
                                    <div key={exp.id} className="p-5 flex justify-between items-center">
                                        <div className="space-y-1">
                                            <p className="text-white font-bold text-sm">{exp.description}</p>
                                            <p className="text-slate-500 text-xs flex items-center gap-1 uppercase font-semibold">
                                                {exp.expenseDate} • {exp.category}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-red-400 font-bold text-sm">-{formatter.format(exp.amount)}</p>
                                            <button onClick={() => openDeleteConfirm(exp.id)} className="text-slate-600 active:text-red-500">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* SECCIÓN INGRESOS */
                        <div className="space-y-4">
                            
                            
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[500px]">
                                        <thead className="bg-slate-800/50 border-b border-slate-800">
                                            <tr>
                                                <th className="p-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Fecha</th>
                                                <th className="p-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Alumno</th>
                                                <th className="p-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Plan</th>
                                                <th className="p-4 text-slate-400 font-bold text-xs uppercase tracking-widest text-right">Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {incomeList.map((inc) => (
                                                <tr key={inc.id} className="hover:bg-emerald-500/5 transition-colors">
                                                    <td className="p-4 text-slate-400 text-sm">{inc.paymentDate}</td>
                                                    <td className="p-4 text-white font-medium">{inc.studentName}</td>
                                                    <td className="p-4 text-slate-500 text-xs">{inc.planName}</td>
                                                    <td className="p-4 text-emerald-400 font-black text-right">{formatter.format(inc.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </>
        )}

        <ExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchFinanceData} />
        <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={confirmDelete} title="¿Eliminar este gasto?" message="Esta acción restará el monto de tus gastos mensuales y no se puede deshacer." loading={deleteLoading} />
    </div>
);
};

export default FinancePage;