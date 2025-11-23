"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Upload, FileText, X, Image as ImageIcon, Settings, Wrench, Camera } from "lucide-react";
import {
    Equipment,
    EquipmentTypeEnum,
    EsquentadorFormSchema,
    TermoacumuladorFormSchema,
    CaldeiraFormSchema,
    BombaCalorFormSchema,
    EquipmentFormSchema,
    EquipmentFormData,
} from "@/lib/types";
import { createEquipment, updateEquipment } from "@/actions/equipment";

type Props = {
    initialData?: Equipment;
};

export function EquipmentForm({ initialData }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<EquipmentFormData>({
        resolver: zodResolver(EquipmentFormSchema) as any,
        defaultValues: initialData || {
            type: "Esquentador",
            marca: "",
            modelo: "",
            notas: "",
        } as any,
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = form;

    const type = watch("type");
    const temQPR = watch("temQPR" as any);
    const seer = watch("seer" as any);
    const scop = watch("scop" as any);
    const pdfName = watch("pdfName");
    const photo = watch("photo");
    const photoName = watch("photoName");

    useEffect(() => {
        if (!initialData) {
            // Optional: reset fields on type change
        }
    }, [type, initialData]);

    const onSubmit = async (data: EquipmentFormData) => {
        console.log("Form submitted with data:", data);
        setError(null);
        startTransition(async () => {
            try {
                if (initialData) {
                    await updateEquipment(initialData.id, data);
                } else {
                    await createEquipment(data);
                }
                router.push("/");
                router.refresh();
            } catch (e) {
                console.error(e);
                setError("Ocorreu um erro ao guardar o equipamento.");
            }
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                alert("Por favor carregue apenas ficheiros PDF.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setValue("pdf", base64);
                setValue("pdfName", file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePdf = () => {
        setValue("pdf", undefined);
        setValue("pdfName", undefined);
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Por favor carregue apenas imagens.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setValue("photo", base64);
                setValue("photoName", file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setValue("photo", undefined);
        setValue("photoName", undefined);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit as any, (errors) => console.log("Validation errors:", errors))} className="max-w-4xl mx-auto space-y-8">

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    {error}
                </div>
            )}



            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Basic Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="glass p-6 md:p-8 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 text-cyan-400">
                                <Settings className="h-5 w-5" />
                            </div>
                            Informação Geral
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-full">
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Tipo de Equipamento</label>
                                <select
                                    {...register("type")}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all outline-none hover:border-slate-700"
                                >
                                    {EquipmentTypeEnum.options.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Marca</label>
                                <input
                                    {...register("marca")}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all outline-none placeholder:text-slate-600 hover:border-slate-700"
                                    placeholder="Ex: Vulcano"
                                />
                                {errors.marca && <p className="text-red-400 text-xs mt-1 ml-1">{errors.marca.message}</p>}
                            </div>

                            <div className="col-span-1">
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Modelo</label>
                                <input
                                    {...register("modelo")}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all outline-none placeholder:text-slate-600 hover:border-slate-700"
                                    placeholder="Ex: ZW 24"
                                />
                                {errors.modelo && <p className="text-red-400 text-xs mt-1 ml-1">{errors.modelo.message}</p>}
                            </div>

                            <div className="col-span-full">
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Notas</label>
                                <textarea
                                    {...register("notas")}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all outline-none placeholder:text-slate-600 resize-none hover:border-slate-700"
                                    placeholder="Informação adicional..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 md:p-8 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
                                <Wrench className="h-5 w-5" />
                            </div>
                            Especificações Técnicas
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ESQUENTADOR */}
                            {type === "Esquentador" && (
                                <>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Energia</label>
                                        <select {...register("energia" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none hover:border-slate-700">
                                            {EsquentadorFormSchema.shape.energia.unwrap().unwrap().options.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Potência (kW)</label>
                                        <input type="number" step="0.01" {...register("potencia")} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" />
                                        {(errors as any).potencia && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).potencia.message}</p>}
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Rendimento Base (%)</label>
                                        <input type="number" step="0.1" {...register("rendimentoBase" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" />
                                        {(errors as any).rendimentoBase && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).rendimentoBase.message}</p>}
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Rendimento Corrigido (%)</label>
                                        <input type="number" step="0.1" {...register("rendimentoCorrigido" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" />
                                        {(errors as any).rendimentoCorrigido && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).rendimentoCorrigido.message}</p>}
                                    </div>
                                </>
                            )}

                            {/* TERMOACUMULADOR */}
                            {type === "Termoacumulador" && (
                                <>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Volume (litros)</label>
                                        <input type="number" step="0.1" {...register("volume" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" />
                                        {(errors as any).volume && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).volume.message}</p>}
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Potência (kW)</label>
                                        <input type="number" step="0.01" {...register("potencia")} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" />
                                        {(errors as any).potencia && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).potencia.message}</p>}
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Rendimento (%)</label>
                                        <input type="number" step="0.1" {...register("rendimento" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" />
                                        {(errors as any).rendimento && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).rendimento.message}</p>}
                                    </div>
                                    <div className="col-span-full flex items-center gap-4 p-4 bg-slate-900/30 rounded-xl border border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" id="temQPR" {...register("temQPR" as any)} className="h-5 w-5 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500" />
                                            <label htmlFor="temQPR" className="text-sm font-medium text-slate-300">Tem QPR?</label>
                                        </div>
                                        {temQPR && (
                                            <div className="flex-1 ml-4">
                                                <input type="number" step="0.01" {...register("valorQPR" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all outline-none font-mono hover:border-slate-700" placeholder="Valor QPR" />
                                                {(errors as any).valorQPR && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).valorQPR.message}</p>}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* AR CONDICIONADO */}
                            {type === "Ar Condicionado" && (
                                <>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Potência Arrefecimento (kW)</label>
                                        <input type="number" step="0.01" {...register("potenciaArrefecimento" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" />
                                        {(errors as any).potenciaArrefecimento && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).potenciaArrefecimento.message}</p>}
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Potência Aquecimento (kW)</label>
                                        <input type="number" step="0.01" {...register("potenciaAquecimento" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" />
                                        {(errors as any).potenciaAquecimento && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).potenciaAquecimento.message}</p>}
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">SEER (Arrefecimento)</label>
                                        <input type="number" step="0.01" {...register("seer" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" placeholder="Opcional" />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">SCOP (Aquecimento)</label>
                                        <input type="number" step="0.01" {...register("scop" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" placeholder="Opcional" />
                                    </div>
                                    {(!seer && !scop) && (
                                        <div className="col-span-1">
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">COP</label>
                                            <input type="number" step="0.01" {...register("cop" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" placeholder="Só se SEER/SCOP vazios" />
                                        </div>
                                    )}
                                </>
                            )}

                            {/* CALDEIRA */}
                            {type === "Caldeira" && (
                                <>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Energia</label>
                                        <select {...register("energia" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none hover:border-slate-700">
                                            {CaldeiraFormSchema.shape.energia.unwrap().unwrap().options.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Potência (kW)</label>
                                        <input type="number" step="0.01" {...register("potencia")} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" />
                                        {(errors as any).potencia && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).potencia.message}</p>}
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Rendimento Base (%)</label>
                                        <input type="number" step="0.1" {...register("rendimentoBase" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" />
                                        {(errors as any).rendimentoBase && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).rendimentoBase.message}</p>}
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Rendimento Corrigido (%)</label>
                                        <input type="number" step="0.1" {...register("rendimentoCorrigido" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" />
                                        {(errors as any).rendimentoCorrigido && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).rendimentoCorrigido.message}</p>}
                                    </div>
                                </>
                            )}

                            {/* BOMBA DE CALOR */}
                            {type === "Bomba de Calor" && (
                                <>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Energia</label>
                                        <select {...register("energia" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none hover:border-slate-700">
                                            {BombaCalorFormSchema.shape.energia.unwrap().unwrap().options.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Volume (litros)</label>
                                        <input type="number" step="0.1" {...register("volume" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" placeholder="Opcional" />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Potência (kW)</label>
                                        <input type="number" step="0.01" {...register("potencia")} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" />
                                        {(errors as any).potencia && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).potencia.message}</p>}
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Rendimento Base</label>
                                        <input type="number" step="0.01" {...register("rendimentoBase" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" />
                                        {(errors as any).rendimentoBase && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).rendimentoBase.message}</p>}
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Rendimento Corrigido</label>
                                        <input type="number" step="0.01" {...register("rendimentoCorrigido" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" />
                                        {(errors as any).rendimentoCorrigido && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).rendimentoCorrigido.message}</p>}
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">COP</label>
                                        <input type="number" step="0.01" {...register("cop" as any)} className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono hover:border-slate-700" />
                                        {(errors as any).cop && <p className="text-red-400 text-xs mt-1 ml-1">{(errors as any).cop.message}</p>}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Media & Actions */}
                <div className="space-y-6">
                    <div className="glass p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20 text-violet-400">
                                <Camera className="h-5 w-5" />
                            </div>
                            Multimédia
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Foto do Equipamento</label>
                                {photo ? (
                                    <div className="relative group rounded-xl overflow-hidden border border-slate-700">
                                        <img src={photo} alt="Preview" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={removePhoto}
                                                className="bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transform hover:scale-110 transition-all"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                            id="photo-upload"
                                        />
                                        <label
                                            htmlFor="photo-upload"
                                            className="flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-900/50 border-2 border-dashed border-slate-700 hover:border-cyan-500 hover:bg-cyan-500/5 text-slate-500 hover:text-cyan-500 p-8 rounded-xl transition-all"
                                        >
                                            <div className="p-3 bg-slate-800 rounded-full shadow-sm">
                                                <ImageIcon className="h-6 w-6" />
                                            </div>
                                            <span className="text-sm font-medium">Carregar Foto</span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Ficha Técnica (PDF)</label>
                                {pdfName ? (
                                    <div className="flex items-center gap-3 bg-cyan-500/10 text-cyan-400 p-4 rounded-xl border border-cyan-500/20">
                                        <div className="p-2 bg-slate-900 rounded-lg shadow-sm">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm font-medium truncate flex-1">{pdfName}</span>
                                        <button type="button" onClick={removePdf} className="text-cyan-400 hover:text-cyan-300 p-1">
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="pdf-upload"
                                        />
                                        <label
                                            htmlFor="pdf-upload"
                                            className="flex items-center gap-3 cursor-pointer bg-slate-900/50 border border-slate-700 hover:border-cyan-500 hover:shadow-md text-slate-400 hover:text-cyan-400 p-4 rounded-xl transition-all group"
                                        >
                                            <div className="p-2 bg-slate-800 group-hover:bg-cyan-500/10 rounded-lg transition-colors">
                                                <Upload className="h-5 w-5 group-hover:text-cyan-500" />
                                            </div>
                                            <span className="text-sm font-medium">Carregar PDF</span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-slate-950 bg-cyan-400 rounded-xl hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending && <Loader2 className="h-5 w-5 animate-spin" />}
                            {initialData ? "Atualizar Equipamento" : "Adicionar Equipamento"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="w-full px-6 py-3 text-sm font-medium text-slate-400 bg-transparent border border-slate-700 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </form >
    );
}
