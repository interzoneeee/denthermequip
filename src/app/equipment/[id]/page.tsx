import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Edit } from "lucide-react";
import { Header } from "@/components/Header";
import { EquipmentForm } from "@/components/EquipmentForm";
import { getEquipmentById } from "@/lib/storage";

export default async function EquipmentPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ edit?: string }>;
}) {
    const { id } = await params;
    const { edit } = await searchParams;
    const equipment = await getEquipmentById(id);

    if (!equipment) {
        notFound();
    }

    const isEditing = edit === "true";

    return (
        <div className="min-h-screen pt-24 pb-12">
            <Header />
            <main className="container mx-auto px-4 max-w-5xl">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors font-mono text-sm uppercase tracking-wider group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to System
                    </Link>
                </div>

                {isEditing ? (
                    <div>
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-bold text-white font-mono tracking-tight">System Configuration</h1>
                            <p className="text-slate-400 mt-2">Modify equipment parameters and specifications.</p>
                        </div>
                        <EquipmentForm initialData={equipment} />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Hero Section */}
                        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-800/90 z-10" />
                            {equipment.photo && (
                                <img
                                    src={equipment.photo}
                                    alt={`${equipment.marca} ${equipment.modelo}`}
                                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay group-hover:opacity-50 transition-opacity duration-700"
                                />
                            )}

                            {/* Grid Pattern Overlay */}
                            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 z-10 pointer-events-none" />

                            <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start justify-between">
                                <div className="space-y-6 max-w-2xl">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-widest backdrop-blur-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                        {equipment.type}
                                    </div>
                                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none">
                                        {equipment.marca} <span className="text-slate-500 font-light">{equipment.modelo}</span>
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-4 pt-2">
                                        <Link
                                            href={`/equipment/${equipment.id}?edit=true`}
                                            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-950 rounded-xl hover:bg-cyan-50 transition-all font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:-translate-y-0.5"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Configure Unit
                                        </Link>
                                        {equipment.pdf && (
                                            <a
                                                href={equipment.pdf}
                                                download={equipment.pdfName || "ficha_tecnica.pdf"}
                                                className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 text-slate-200 rounded-xl hover:bg-slate-700/50 hover:text-white transition-all font-medium border border-slate-700 hover:border-slate-600 backdrop-blur-sm"
                                            >
                                                <Download className="h-4 w-4" />
                                                Datasheet
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {equipment.photo && (
                                    <div className="hidden md:block h-48 w-48 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500 relative">
                                        <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay z-10" />
                                        <img
                                            src={equipment.photo}
                                            alt="Thumbnail"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bento Grid Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Primary Stats Card */}
                            <div className="md:col-span-2 glass p-8 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <div className="w-32 h-32 bg-cyan-500 rounded-full blur-3xl" />
                                </div>
                                <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                                    <div className="h-px w-8 bg-cyan-500/50" />
                                    Performance Metrics
                                </h3>
                                <div className="grid grid-cols-2 gap-12">
                                    {equipment.type === "Ar Condicionado" ? (
                                        <>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Cooling Capacity</p>
                                                <p className="text-4xl font-bold text-white font-mono tracking-tight">{equipment.potenciaArrefecimento} <span className="text-xl text-slate-500 font-sans">kW</span></p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Heating Capacity</p>
                                                <p className="text-4xl font-bold text-white font-mono tracking-tight">{equipment.potenciaAquecimento} <span className="text-xl text-slate-500 font-sans">kW</span></p>
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Power Output</p>
                                            <p className="text-4xl font-bold text-white font-mono tracking-tight">
                                                {"potencia" in equipment ? equipment.potencia : "-"} <span className="text-xl text-slate-500 font-sans">kW</span>
                                            </p>
                                        </div>
                                    )}

                                    {"energia" in equipment && (
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Power Source</p>
                                            <p className="text-2xl font-bold text-white">{equipment.energia}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Efficiency Card */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 border border-slate-800 shadow-lg relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50" />
                                <h3 className="text-sm font-mono text-emerald-400 uppercase tracking-widest mb-8 flex items-center gap-3 relative z-10">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Efficiency
                                </h3>
                                <div className="space-y-8 relative z-10">
                                    {"rendimentoBase" in equipment && (
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Base Efficiency</p>
                                            <p className="text-4xl font-bold text-white font-mono">{equipment.rendimentoBase}<span className="text-emerald-400 text-2xl">%</span></p>
                                        </div>
                                    )}
                                    {"seer" in equipment && equipment.seer && (
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">SEER Rating</p>
                                            <p className="text-4xl font-bold text-white font-mono">{equipment.seer}</p>
                                        </div>
                                    )}
                                    {"cop" in equipment && equipment.cop && (
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">COP Rating</p>
                                            <p className="text-4xl font-bold text-white font-mono">{equipment.cop}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {"volume" in equipment && equipment.volume && (
                                    <div className="glass p-5 rounded-2xl">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Volume</p>
                                        <p className="text-xl font-bold text-slate-200 font-mono">{equipment.volume} <span className="text-sm text-slate-500">L</span></p>
                                    </div>
                                )}
                                {"temQPR" in equipment && (
                                    <div className="glass p-5 rounded-2xl">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">QPR Status</p>
                                        <p className="text-xl font-bold text-slate-200 font-mono">{equipment.temQPR ? equipment.valorQPR : "N/A"}</p>
                                    </div>
                                )}
                                {"rendimentoCorrigido" in equipment && (
                                    <div className="glass p-5 rounded-2xl">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Corrected Eff.</p>
                                        <p className="text-xl font-bold text-slate-200 font-mono">{equipment.rendimentoCorrigido}<span className="text-sm text-slate-500">%</span></p>
                                    </div>
                                )}
                                {"scop" in equipment && equipment.scop && (
                                    <div className="glass p-5 rounded-2xl">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">SCOP</p>
                                        <p className="text-xl font-bold text-slate-200 font-mono">{equipment.scop}</p>
                                    </div>
                                )}
                            </div>

                            {/* Notes Section */}
                            {equipment.notas && (
                                <div className="md:col-span-3 glass rounded-3xl p-8">
                                    <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                                        <div className="h-px w-8 bg-slate-700" />
                                        System Notes
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-light">
                                        {equipment.notas}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
