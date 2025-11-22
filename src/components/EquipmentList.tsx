"use client";

import { Equipment } from "@/lib/types";
import { EquipmentCard } from "./EquipmentCard";
import { motion, AnimatePresence } from "framer-motion";

export function EquipmentList({ equipments }: { equipments: Equipment[] }) {
    if (equipments.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800 shadow-sm backdrop-blur-sm flex flex-col items-center">
                <div className="h-20 w-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 ring-1 ring-slate-700 shadow-lg">
                    <svg className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-200 mb-2">No Equipment Found</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-8">
                    Get started by adding your first equipment unit to the system.
                </p>
                <a
                    href="/add"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-slate-950 font-semibold rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5"
                >
                    Add Equipment
                </a>
            </div>
        );
    }

    return (
        <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <AnimatePresence mode="popLayout">
                {equipments.map((eq) => (
                    <motion.div
                        layout
                        key={eq.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        <EquipmentCard equipment={eq} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
