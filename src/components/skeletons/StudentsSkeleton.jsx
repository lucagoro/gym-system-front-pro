const StudentsSkeleton = () => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-5 border-b border-slate-800 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-800 rounded-full"></div>
                    <div className="h-4 w-32 bg-slate-800 rounded"></div>
                </div>
                <div className="hidden md:block h-4 w-24 bg-slate-800 rounded"></div>
                <div className="h-8 w-20 bg-slate-800 rounded-lg"></div>
            </div>
        ))}
    </div>
);

export default StudentsSkeleton;