import React from "react";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    register: UseFormRegisterReturn;
    options: string[];
    error?: FieldError;
    className?: string;
}

export function FormSelect({ label, register, options, error, className, ...props }: FormSelectProps) {
    return (
        <div className={cn("col-span-1", className)}>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                {label}
            </label>
            <select
                {...register}
                {...props}
                className={cn(
                    "w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all outline-none hover:border-slate-700",
                    error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                )}
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-400 text-xs mt-1 ml-1">{error.message}</p>}
        </div>
    );
}
