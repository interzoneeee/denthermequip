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
        const newEquipment = await prisma.equipment.create({
            data: {
                ...data,
                // Ensure optional fields are handled correctly (undefined -> null for Prisma if needed, but Prisma handles undefined as "do not set" or null depending on config)
                // Actually Prisma create expects null for optional fields if not provided, or undefined to skip.
                // We pass data directly.
            } as any,
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
        await prisma.equipment.update({
            where: { id },
            data: data as any,
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
