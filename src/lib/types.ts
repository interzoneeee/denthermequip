import { z } from "zod";

export const EquipmentTypeEnum = z.enum([
    "Esquentador",
    "Termoacumulador",
    "Ar Condicionado",
    "Caldeira",
    "Bomba de Calor",
]);

export type EquipmentType = z.infer<typeof EquipmentTypeEnum>;

// Helper for optional string fields (converts "" and undefined to null)
const optionalString = z.preprocess(
    (val) => (val === "" || val === undefined ? null : val),
    z.string().nullable().optional()
);

// Helper for optional number fields (converts "", undefined, and null to null)
const optionalNumber = z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? null : val),
    z.nullable(z.coerce.number()).optional()
);

// Helper for required number fields - NOW OPTIONAL per user request
const requiredNumber = optionalNumber;

// Base schema for FORM (no system fields)
const BaseFormSchema = z.object({
    type: EquipmentTypeEnum,
    marca: z.string().min(1, "Marca é obrigatória"),
    modelo: z.string().min(1, "Modelo é obrigatório"),
    notas: optionalString,
    dataFabrico: optionalString, // ISO date string
    pdf: optionalString, // Base64 string
    pdfName: optionalString,
    photo: optionalString, // Base64 string
    photoName: optionalString,
});

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
    temQPR: z.preprocess(
        (val) => (val === null || val === undefined || val === false || val === "" ? false : Boolean(val)),
        z.boolean().default(false)
    ),
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

// Flat type for React Hook Form to avoid "as any" when accessing fields that don't exist in all types
export type FlatEquipmentFormData = {
    type: EquipmentType;
    marca: string;
    modelo: string;
    notas?: string | null;
    dataFabrico?: string | null;
    pdf?: string | null;
    pdfName?: string | null;
    photo?: string | null;
    photoName?: string | null;

    // Union of all technical fields
    energia?: string | null;
    potencia?: number | null;
    rendimentoBase?: number | null;
    rendimentoCorrigido?: number | null;
    volume?: number | null;
    rendimento?: number | null;
    temQPR?: boolean | null;
    valorQPR?: number | null;
    potenciaArrefecimento?: number | null;
    potenciaAquecimento?: number | null;
    seer?: number | null;
    scop?: number | null;
    cop?: number | null;
};

