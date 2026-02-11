const DashboardSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        {/* Skeleton de las Stats (4 cajitas) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-slate-900/50 border border-slate-800 rounded-3xl"></div>
            ))}
        </div>

        {/* Skeleton de los Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[350px] bg-slate-900/50 border border-slate-800 rounded-3xl"></div>
            <div className="h-[350px] bg-slate-900/50 border border-slate-800 rounded-3xl"></div>
        </div>
    </div>
);

export default DashboardSkeleton;