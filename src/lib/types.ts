import { z } from "zod";

export const EquipmentTypeEnum = z.enum([
    "Esquentador",
    "Termoacumulador",
    "Ar Condicionado",
    "Caldeira",
    "Bomba de Calor",
]);

export type EquipmentType = z.infer<typeof EquipmentTypeEnum>;

// Base schema for FORM (no system fields)
const BaseFormSchema = z.object({
    type: EquipmentTypeEnum,
    marca: z.string().optional(),
    modelo: z.string().optional(),
    notas: z.string().nullable().optional(),
    dataFabrico: z.string().nullable().optional(), // ISO date string
    pdf: z.string().nullable().optional(), // Base64 string
    pdfName: z.string().nullable().optional(),
    photo: z.string().nullable().optional(), // Base64 string
    photoName: z.string().nullable().optional(),
});

// Helper for optional number fields
const optionalNumber = z.preprocess(
    (val) => (val === "" ? null : val),
    z.nullable(z.coerce.number()).optional()
);

// Helper for required number fields - NOW OPTIONAL per user request
const requiredNumber = optionalNumber;

// 1. ESQUENTADOR
export const EsquentadorFormSchema = BaseFormSchema.extend({
    type: z.literal("Esquentador"),
    energia: z.enum([
        "Electricidade",
        "Electricidade vazio",
        "Gás Natural",
        "Gás propano (garrafa)",
        "Gás propano (rede)",
        "Pellets (granulados)",
        "Biomassa sólida",
        "Gás butano",
    ]).nullable().optional(),
    potencia: requiredNumber,
    rendimentoBase: requiredNumber,
    rendimentoCorrigido: requiredNumber,
});

// 2. TERMOACUMULADOR
export const TermoacumuladorFormSchema = BaseFormSchema.extend({
    type: z.literal("Termoacumulador"),
    volume: requiredNumber,
    potencia: requiredNumber,
    rendimento: requiredNumber,
    temQPR: z.preprocess((val) => val === null ? false : val, z.boolean().default(false)),
    valorQPR: optionalNumber,
});

// 3. AR CONDICIONADO
export const ACFormSchema = BaseFormSchema.extend({
    type: z.literal("Ar Condicionado"),
    potenciaArrefecimento: requiredNumber,
    potenciaAquecimento: requiredNumber,
    seer: optionalNumber,
    scop: optionalNumber,
    cop: optionalNumber,
});

// 4. CALDEIRA
export const CaldeiraFormSchema = BaseFormSchema.extend({
    type: z.literal("Caldeira"),
    energia: z.enum([
        "Electricidade",
        "Electricidade vazio",
        "Gás natural",
        "Gás propano (garrafa)",
        "Gás propano (rede)",
        "Gás butano",
        "Gasóleo",
        "Lenha",
        "Carvão vegetal",
        "Pellets (granulados)",
        "Biomassa sólida",
        "Biomassa líquida",
        "Biomassa gasosa",
    ]).nullable().optional(),
    potencia: requiredNumber,
    rendimentoBase: requiredNumber,
    rendimentoCorrigido: requiredNumber,
});

// 5. BOMBA DE CALOR
export const BombaCalorFormSchema = BaseFormSchema.extend({
    type: z.literal("Bomba de Calor"),
    energia: z.enum(["Electricidade", "Electricidade vazio", "padrão"]).nullable().optional(),
    volume: optionalNumber,
    potencia: requiredNumber,
    rendimentoBase: requiredNumber,
    rendimentoCorrigido: requiredNumber,
    cop: requiredNumber,
});

export const EquipmentFormSchema = z.discriminatedUnion("type", [
    EsquentadorFormSchema,
    TermoacumuladorFormSchema,
    ACFormSchema,
    CaldeiraFormSchema,
    BombaCalorFormSchema,
]);

export type EquipmentFormData = z.infer<typeof EquipmentFormSchema>;

// Full Equipment type includes system fields
export type Equipment = EquipmentFormData & {
    id: string;
    createdAt: string;
    updatedAt: string;
};

// Export specific form types if needed
export type EsquentadorFormData = z.infer<typeof EsquentadorFormSchema>;
export type TermoacumuladorFormData = z.infer<typeof TermoacumuladorFormSchema>;
export type ACFormData = z.infer<typeof ACFormSchema>;
export type CaldeiraFormData = z.infer<typeof CaldeiraFormSchema>;
export type BombaCalorFormData = z.infer<typeof BombaCalorFormSchema>;

// Re-export old names for compatibility if needed, or just rely on Equipment type
// We removed EquipmentSchema as a Zod schema for the full object because we don't validate the full object on client usually.
// If we need it, we can define it, but for now Equipment type is sufficient.
