const FinanceSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        {/* Skeleton de Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-900 border border-slate-800 rounded-3xl p-6">
                    <div className="h-4 w-32 bg-slate-800 rounded mb-4"></div>
                    <div className="h-8 w-48 bg-slate-800 rounded"></div>
                </div>
            ))}
        </div>

        {/* Skeleton de Tabla de Gastos */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-800/30">
                <div className="h-6 w-40 bg-slate-800 rounded"></div>
            </div>
            <div className="space-y-4 p-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                        <div className="h-4 w-1/4 bg-slate-800 rounded"></div>
                        <div className="h-4 w-1/4 bg-slate-800 rounded"></div>
                        <div className="h-4 w-12 bg-slate-800 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default FinanceSkeleton;