import { Header } from "@/components/Header";
import { EquipmentForm } from "@/components/EquipmentForm";

export default function AddEquipmentPage() {
    return (
        <div className="min-h-screen pt-24 pb-12">
            <Header />
            <main className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Adicionar Novo Equipamento</h1>
                    <p className="text-slate-400">Preencha os dados técnicos do equipamento.</p>
                </div>
                <EquipmentForm />
            </main>
        </div>
    );
}
