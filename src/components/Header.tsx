import Link from "next/link";
import { Zap } from "lucide-react";

export function Header() {
    return (
        <header className="fixed top-4 left-0 right-0 z-50 px-4">
            <div className="container mx-auto max-w-5xl">
                <div className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-2xl shadow-black/50">
                    <Link href="/" className="group flex items-center gap-3 transition-transform hover:scale-105">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative p-2 bg-slate-900 border border-slate-700 rounded-xl">
                                <Zap className="h-5 w-5 text-cyan-400" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-white tracking-tight leading-none font-mono">
                                Equipment Manager
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                DENtherm
                            </span>
                        </div>
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link
                            href="/add"
                            className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 px-5 py-2 rounded-full text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] group"
                        >
                            <span>Adicionar</span>
                            <span className="bg-cyan-500/20 text-cyan-300 rounded-full w-5 h-5 flex items-center justify-center text-xs group-hover:bg-cyan-500 group-hover:text-slate-900 transition-colors">+</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
