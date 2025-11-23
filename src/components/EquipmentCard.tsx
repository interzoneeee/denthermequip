"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, Zap, Thermometer, Wind, Flame, Droplets, Copy, Check } from "lucide-react";
import { Equipment } from "@/lib/types";
import { deleteEquipment } from "@/actions/equipment";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { cn } from "@/lib/utils";

const TypeIcons = {
    "Esquentador": Flame,
    "Termoacumulador": Droplets,
    "Ar Condicionado": Wind,
    "Caldeira": Thermometer,
    "Bomba de Calor": Zap,
};

const TypeColors = {
    "Esquentador": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "Termoacumulador": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Ar Condicionado": "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    "Caldeira": "bg-red-500/10 text-red-500 border-red-500/20",
    "Bomba de Calor": "bg-green-500/10 text-green-500 border-green-500/20",
};

export function EquipmentCard({ equipment }: { equipment: Equipment }) {
    const [showDelete, setShowDelete] = useState(false);
    const [isDeleting, startTransition] = useTransition();
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const Icon = TypeIcons[equipment.type] || Zap;
    const colorClass = TypeColors[equipment.type] || "bg-slate-800 text-slate-400 border-slate-700";

    const handleDelete = () => {
        startTransition(async () => {
            await deleteEquipment(equipment.id);
            setShowDelete(false);
        });
    };

    const copyToClipboard = (text: string | number | undefined | null, label: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text.toString());
        setCopiedField(label);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const DataField = ({ label, value, unit = "", className = "", copyable = false }: { label: string, value: string | number | undefined | null, unit?: string, className?: string, copyable?: boolean }) => {
        if (value === undefined || value === null) return null;
        const isCopied = copiedField === label;

        if (!copyable) {
            return (
                <div className={cn("flex flex-col items-start p-2 rounded-lg border border-transparent text-left w-full", className)}>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-0.5 flex items-center gap-1.5">
                        {label}
                    </span>
                    <span className="font-mono text-sm text-slate-200 truncate w-full">
                        {value} <span className="text-slate-500 text-xs">{unit}</span>
                    </span>
                </div>
            );
        }

        return (
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    copyToClipboard(value, label);
                }}
                className={cn(
                    "flex flex-col items-start p-2 rounded-lg transition-all border border-transparent hover:bg-slate-800/50 hover:border-slate-700 group/field text-left w-full",
                    className
                )}
                title="Clique para copiar"
            >
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-0.5 flex items-center gap-1.5">
                    {label}
                    {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 opacity-0 group-hover/field:opacity-50 transition-opacity" />}
                </span>
                <span className="font-mono text-sm text-slate-200 truncate w-full">
                    {value} <span className="text-slate-500 text-xs">{unit}</span>
                </span>
            </button>
        );
    };

    return (
        <>
            <Link
                href={`/equipment/${equipment.id}`}
                className="group relative bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] flex flex-col sm:flex-row h-full cursor-pointer"
            >

                {/* Image Section - Vertical on Desktop */}
                <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-slate-950 shrink-0 border-b sm:border-b-0 sm:border-r border-slate-800">
                    {equipment.photo ? (
                        <>
                            <Image
                                src={equipment.photo}
                                alt={equipment.marca || "Equipamento"}
                                fill
                                className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                                sizes="(max-width: 640px) 100vw, 200px"
                            />
                        </>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-slate-900/50">
                            <Icon className="h-12 w-12 text-slate-800" />
                        </div>
                    )}

                    {/* Type Badge Overlay */}
                    <div className="absolute top-3 left-3 z-20">
                        <div className={cn("p-2 rounded-lg backdrop-blur-md border shadow-lg", colorClass)}>
                            <Icon className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header & Actions */}
                    <div className="p-4 border-b border-slate-800/50 flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1">
                            <div
                                onClick={(e) => { e.preventDefault(); copyToClipboard(equipment.marca, "Marca"); }}
                                className="cursor-pointer hover:text-cyan-400 transition-colors group/title w-fit"
                            >
                                <h3 className="font-bold text-slate-200 text-lg leading-tight truncate flex items-center gap-2">
                                    {equipment.marca || "Sem Marca"}
                                    {copiedField === "Marca" && <Check className="h-4 w-4 text-emerald-500" />}
                                </h3>
                            </div>
                            <div
                                onClick={(e) => { e.preventDefault(); copyToClipboard(equipment.modelo, "Modelo"); }}
                                className="cursor-pointer hover:text-cyan-400 transition-colors group/subtitle w-fit"
                            >
                                <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-wider flex items-center gap-2">
                                    {equipment.modelo || "Sem Modelo"}
                                    {copiedField === "Modelo" && <Check className="h-3 w-3 text-emerald-500" />}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <Link
                                href={`/equipment/${equipment.id}?edit=true`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 rounded-lg transition-all"
                                title="Editar"
                            >
                                <Edit className="h-4 w-4" />
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowDelete(true);
                                }}
                                className="p-2 bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/50 rounded-lg transition-all"
                                title="Eliminar"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Data Grid - No Scrollbar */}
                    <div className="flex-1 p-4">
                        <div className="grid grid-cols-2 gap-2">
                            {/* Common Fields */}
                            <DataField label="ID" value={equipment.id} className="col-span-2 font-mono text-[10px]" copyable={true} />
                            {equipment.dataFabrico && (
                                <DataField
                                    label="Data Fabrico"
                                    value={new Date(equipment.dataFabrico).toLocaleDateString('pt-PT')}
                                    className="col-span-2"
                                    copyable={true}
                                />
                            )}

                            {/* Specific Fields based on Type */}
                            {equipment.type === "Esquentador" && (
                                <>
                                    <DataField label="Potência" value={equipment.potencia} unit="kW" copyable={true} />
                                    <DataField label="Energia" value={equipment.energia} copyable={true} />
                                    <DataField label="Rendimento Base" value={equipment.rendimentoBase} unit="%" copyable={true} />
                                    <DataField label="Rendimento Corr." value={equipment.rendimentoCorrigido} unit="%" copyable={true} />
                                </>
                            )}

                            {equipment.type === "Termoacumulador" && (
                                <>
                                    <DataField label="Volume" value={equipment.volume} unit="L" copyable={true} />
                                    <DataField label="Potência" value={equipment.potencia} unit="kW" copyable={true} />
                                    <DataField label="Rendimento" value={equipment.rendimento} unit="%" copyable={true} />
                                    {equipment.temQPR && <DataField label="Valor QPR" value={equipment.valorQPR} unit="kWh" copyable={true} />}
                                </>
                            )}

                            {equipment.type === "Ar Condicionado" && (
                                <>
                                    <DataField label="Pot. Frio" value={equipment.potenciaArrefecimento} unit="kW" className="text-cyan-400" copyable={true} />
                                    <DataField label="Pot. Quente" value={equipment.potenciaAquecimento} unit="kW" className="text-orange-400" copyable={true} />
                                    <DataField label="SEER" value={equipment.seer} copyable={true} />
                                    <DataField label="SCOP" value={equipment.scop} copyable={true} />
                                    <DataField label="COP" value={equipment.cop} copyable={true} />
                                </>
                            )}

                            {equipment.type === "Caldeira" && (
                                <>
                                    <DataField label="Potência" value={equipment.potencia} unit="kW" copyable={true} />
                                    <DataField label="Energia" value={equipment.energia} copyable={true} />
                                    <DataField label="Rendimento Base" value={equipment.rendimentoBase} unit="%" copyable={true} />
                                    <DataField label="Rendimento Corr." value={equipment.rendimentoCorrigido} unit="%" copyable={true} />
                                </>
                            )}

                            {equipment.type === "Bomba de Calor" && (
                                <>
                                    <DataField label="Potência" value={equipment.potencia} unit="kW" copyable={true} />
                                    <DataField label="Energia" value={equipment.energia} copyable={true} />
                                    <DataField label="COP" value={equipment.cop} copyable={true} />
                                    <DataField label="Volume" value={equipment.volume} unit="L" copyable={true} />
                                    <DataField label="Rendimento Base" value={equipment.rendimentoBase} unit="%" copyable={true} />
                                    <DataField label="Rendimento Corr." value={equipment.rendimentoCorrigido} unit="%" copyable={true} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            <DeleteConfirmation
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </>
    );
}
