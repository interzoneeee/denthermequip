"use server";

import { revalidatePath } from "next/cache";
import { Equipment, EquipmentFormSchema } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type PrismaEquipment = {
    id: string;
    type: string;
    marca: string;
    modelo: string;
    notas: string | null;
    dataFabrico: Date | null;
    photo: string | null;
    photoName: string | null;
    pdf: string | null;
    pdfName: string | null;
    energia: string | null;
    potencia: number | null;
    rendimentoBase: number | null;
    rendimentoCorrigido: number | null;
    volume: number | null;
    rendimento: number | null;
    temQPR: boolean | null;
    valorQPR: number | null;
    potenciaArrefecimento: number | null;
    potenciaAquecimento: number | null;
    seer: number | null;
    scop: number | null;
    cop: number | null;
    createdAt: Date;
    updatedAt: Date;
};

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
    const safeEquipments = equipments.map((eq: PrismaEquipment) => ({
        ...eq,
        dataFabrico: eq.dataFabrico ? eq.dataFabrico.toISOString() : null,
        createdAt: eq.createdAt.toISOString(),
        updatedAt: eq.updatedAt.toISOString(),
    })) as unknown as Equipment[];

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

    if (!equipment) return null;

    return {
        ...equipment,
        dataFabrico: equipment.dataFabrico ? equipment.dataFabrico.toISOString() : null,
        createdAt: equipment.createdAt.toISOString(),
        updatedAt: equipment.updatedAt.toISOString(),
    } as unknown as Equipment;
}

export async function createEquipment(data: Omit<Equipment, "id" | "createdAt" | "updatedAt">) {
    try {
        // Validate data with Zod
        const validatedData = EquipmentFormSchema.parse(data);

        // Handle dataFabrico: convert string to Date ISO string if present
        // Prisma expects a Date object or ISO string for DateTime fields
        let dataFabrico: string | Date | null = null;
        if (validatedData.dataFabrico) {
            dataFabrico = new Date(validatedData.dataFabrico).toISOString();
        }

        // Prepare data for Prisma - remove dataFabrico from spread and add it separately
        const { dataFabrico: _, ...restData } = validatedData;

        const newEquipment = await prisma.equipment.create({
            data: {
                ...restData,
                dataFabrico,
            },
        });

        revalidatePath("/");
        return { success: true, id: newEquipment.id };
    } catch (error) {
        console.error("Error in createEquipment:", error);
        if (error instanceof z.ZodError) {
            throw new Error(`Erro de validação: ${error.issues.map((e) => e.message).join(", ")}`);
        }
        throw error;
    }
}

export async function updateEquipment(id: string, data: Partial<Omit<Equipment, "id" | "createdAt" | "updatedAt">>) {
    console.log("Server action updateEquipment called with:", { id, data });
    try {
        // Fetch current equipment to merge and validate
        const currentEquipment = await prisma.equipment.findUnique({ where: { id } });
        if (!currentEquipment) throw new Error("Equipamento não encontrado");

        // Convert current Prisma data to Form data format for validation
        const currentFormData = {
            ...currentEquipment,
            dataFabrico: currentEquipment.dataFabrico ? currentEquipment.dataFabrico.toISOString() : null,
            // We don't need system fields for validation, but spreading is fine
        };

        // Merge current data with new data
        const mergedData = { ...currentFormData, ...data };

        // Validate merged data - Zod will strip extra fields like id/createdAt automatically
        const validatedData = EquipmentFormSchema.parse(mergedData);

        // Handle dataFabrico: convert string to Date ISO string if present
        let dataFabrico: string | Date | null = null;
        if (validatedData.dataFabrico) {
            dataFabrico = new Date(validatedData.dataFabrico).toISOString();
        }

        // Prepare data for Prisma - remove dataFabrico from spread and add it separately
        const { dataFabrico: _, ...restData } = validatedData;

        // If type is changing, we need to clear fields from the old type
        if (currentEquipment.type !== validatedData.type) {
            console.log(`Type changing from ${currentEquipment.type} to ${validatedData.type}. Clearing obsolete fields.`);

            const technicalFields = [
                "energia", "potencia", "rendimentoBase", "rendimentoCorrigido",
                "volume", "rendimento", "temQPR", "valorQPR",
                "potenciaArrefecimento", "potenciaAquecimento", "seer", "scop", "cop"
            ];

            const clearData: Record<string, null> = {};
            technicalFields.forEach(field => {
                clearData[field] = null;
            });

            // Merge clearData with new data. New data takes precedence.
            const finalData = {
                ...clearData,
                ...restData,
                dataFabrico,
            };

            await prisma.equipment.update({
                where: { id },
                data: finalData,
            });
        } else {
            // Normal update
            await prisma.equipment.update({
                where: { id },
                data: {
                    ...restData,
                    dataFabrico,
                },
            });
        }

        revalidatePath("/");
        revalidatePath(`/equipment/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error in updateEquipment:", error);
        if (error instanceof z.ZodError) {
            throw new Error(`Erro de validação: ${error.issues.map((e) => e.message).join(", ")}`);
        }
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
