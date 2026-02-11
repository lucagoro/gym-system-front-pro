const PlansSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] h-[320px] flex flex-col justify-between">
                <div>
                    {/* Skeleton del Título */}
                    <div className="h-7 w-32 bg-slate-800 rounded-lg mb-4"></div>
                    {/* Skeleton del Precio */}
                    <div className="h-10 w-48 bg-slate-800 rounded-xl mb-6"></div>
                    {/* Skeleton del Badge de Días */}
                    <div className="h-8 w-36 bg-slate-800/50 rounded-xl"></div>
                </div>
                
                {/* Skeleton de los Botones */}
                <div className="flex gap-3">
                    <div className="h-12 flex-1 bg-slate-800 rounded-xl"></div>
                    <div className="h-12 w-12 bg-slate-800 rounded-xl"></div>
                </div>
            </div>
        ))}
    </div>
);

export default PlansSkeleton;