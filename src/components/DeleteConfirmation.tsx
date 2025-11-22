"use client";

import { Loader2, AlertTriangle } from "lucide-react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
};

export function DeleteConfirmation({ isOpen, onClose, onConfirm, isDeleting }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-4 text-red-600 mb-4">
                    <div className="bg-red-100 p-2 rounded-full">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">Eliminar Equipamento</h3>
                </div>

                <p className="text-gray-600 mb-6">
                    Tem a certeza que pretende eliminar este equipamento? Esta ação não pode ser desfeita.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                        {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}
