export default function Loading() {
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-pulse">
                    <div>
                        <div className="h-12 w-64 bg-slate-800 rounded-lg mb-3" />
                        <div className="h-6 w-96 bg-slate-800/50 rounded-lg" />
                    </div>
                    <div className="h-12 w-full md:w-96 bg-slate-800 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-64 bg-slate-900/50 rounded-2xl border border-slate-800" />
                    ))}
                </div>
            </div>
        </div>
    );
}
