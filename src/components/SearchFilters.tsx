"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { EquipmentTypeEnum } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useEffect, useState, useTransition } from "react";

const TYPES = ["Todos", ...EquipmentTypeEnum.options];

export function SearchFilters() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("query")?.toString() || "");

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (searchTerm) {
                params.set("query", searchTerm);
            } else {
                params.delete("query");
            }
            startTransition(() => {
                replace(`/?${params.toString()}`);
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, replace, searchParams]);

    const handleTypeChange = (type: string) => {
        const params = new URLSearchParams(searchParams);
        if (type && type !== "Todos") {
            params.set("type", type);
        } else {
            params.delete("type");
        }
        startTransition(() => {
            replace(`/?${params.toString()}`);
        });
    };

    return (
        <div className="space-y-4 mb-6">
            <div className="relative group">
                <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                <input
                    className="relative w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all shadow-lg shadow-black/20"
                    placeholder="Pesquisar por Marca ou Modelo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap gap-2">
                {TYPES.map((type) => {
                    const isActive = (searchParams.get("type") || "Todos") === type;
                    return (
                        <button
                            key={type}
                            onClick={() => handleTypeChange(type)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border",
                                isActive
                                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                    : "bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200 hover:bg-slate-800"
                            )}
                        >
                            {type}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
