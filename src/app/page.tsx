import { Suspense } from "react";
import { Header } from "@/components/Header";
import { EquipmentGrid } from "@/components/EquipmentGrid";
import { SearchFilters } from "@/components/SearchFilters";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; type?: string; page?: string }>;
}) {
  const { query = "", type = "Todos", page = "1" } = await searchParams;
  const currentPage = Number(page) || 1;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <Header />
      <main className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight font-mono">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">System</span> Overview
            </h1>
            <p className="text-slate-400 max-w-xl text-lg">
              Monitorize e gerencie a eficiência energética dos seus equipamentos em tempo real.
            </p>
          </div>
          <SearchFilters />
        </div>

        <Suspense
          key={query + type + currentPage}
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-slate-900/50 rounded-2xl border border-slate-800" />
              ))}
            </div>
          }
        >
          <EquipmentGrid query={query} type={type} page={currentPage} />
        </Suspense>
      </main>
    </div>
  );
}
