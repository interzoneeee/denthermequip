"use server";

import { revalidatePath } from "next/cache";
import { Equipment } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getEquipments(query?: string, type?: string, page: number = 1, limit: number = 9) {
    const where: any = {};

    if (type && type !== "Todos") {
        where.type = type;
    }

    if (query) {
        where.OR = [
            { marca: { contains: query, mode: "insensitive" } },
            { modelo: { contains: query, mode: "insensitive" } },
        ];
    }

    const [equipments, totalItems] = await Promise.all([
        prisma.equipment.findMany({
            where,
            orderBy: { updatedAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.equipment.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.max(1, Math.min(page, totalPages));

    // Cast Prisma result to Equipment type (handling nulls/undefined compatibility if needed)
    // Prisma returns null for optional fields, Zod might be lenient or we might need to map.
    // For now, assuming direct compatibility or simple casting is enough as JSON serialization handles nulls.
    const safeEquipments = equipments as unknown as Equipment[];

    return {
        equipments: safeEquipments,
        totalPages,
        currentPage,
        totalItems
    };
}

export async function getEquipmentById(id: string) {
    const equipment = await prisma.equipment.findUnique({
        where: { id },
    });
    return equipment as unknown as Equipment | null;
}

export async function createEquipment(data: Omit<Equipment, "id" | "createdAt" | "updatedAt">) {
    try {
        // Sanitize data before sending to Prisma
        const sanitizedData = { ...data };

        // Handle dataFabrico: convert string to Date ISO string if present
        if (typeof sanitizedData.dataFabrico === 'string') {
            // Ensure it's a valid ISO string for Prisma DateTime
            sanitizedData.dataFabrico = new Date(sanitizedData.dataFabrico).toISOString();
        }

        const newEquipment = await prisma.equipment.create({
            data: sanitizedData as any,
        });

        revalidatePath("/");
        return { success: true, id: newEquipment.id };
    } catch (error) {
        console.error("Error in createEquipment:", error);
        throw error;
    }
}

export async function updateEquipment(id: string, data: Partial<Equipment>) {
    console.log("Server action updateEquipment called with:", { id, data });
    try {
        // Sanitize data
        const sanitizedData = { ...data };

        // Handle dataFabrico
        if (typeof sanitizedData.dataFabrico === 'string') {
            sanitizedData.dataFabrico = new Date(sanitizedData.dataFabrico).toISOString();
        }

        // If type is changing, we need to clear fields from the old type
        if (sanitizedData.type) {
            const currentEquipment = await prisma.equipment.findUnique({
                where: { id },
                select: { type: true }
            });

            if (currentEquipment && currentEquipment.type !== sanitizedData.type) {
                console.log(`Type changing from ${currentEquipment.type} to ${sanitizedData.type}. Clearing obsolete fields.`);

                // Define all technical fields that should be cleared if they don't belong to the new type
                // For simplicity, we can just set ALL technical fields to null, and then apply the new data
                // The new data will overwrite the nulls for the fields that are actually present in the form
                const technicalFields = [
                    "energia", "potencia", "rendimentoBase", "rendimentoCorrigido",
                    "volume", "rendimento", "temQPR", "valorQPR",
                    "potenciaArrefecimento", "potenciaAquecimento", "seer", "scop", "cop"
                ];

                const clearData: any = {};
                technicalFields.forEach(field => {
                    clearData[field] = null;
                });

                // First clear everything, then apply new data
                // We merge clearData and data. data takes precedence (contains the new values)
                const finalData = { ...clearData, ...sanitizedData };

                await prisma.equipment.update({
                    where: { id },
                    data: finalData,
                });

                revalidatePath("/");
                revalidatePath(`/equipment/${id}`);
                return { success: true };
            }
        }

        // Normal update (no type change)
        await prisma.equipment.update({
            where: { id },
            data: sanitizedData as any,
        });

        revalidatePath("/");
        revalidatePath(`/equipment/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error in updateEquipment:", error);
        throw error;
    }
}

export async function deleteEquipment(id: string) {
    try {
        await prisma.equipment.delete({
            where: { id },
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error in deleteEquipment:", error);
        throw error;
    }
}
