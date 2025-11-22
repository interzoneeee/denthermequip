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
    marca: z.string().min(1, "Marca é obrigatória"),
    modelo: z.string().min(1, "Modelo é obrigatório"),
    notas: z.string().optional(),
    pdf: z.string().optional(), // Base64 string
    pdfName: z.string().optional(),
    photo: z.string().optional(), // Base64 string
    photoName: z.string().optional(),
});

// Helper for optional number fields
const optionalNumber = z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number().optional()
);

// Helper for required number fields
const requiredNumber = z.coerce.number().min(0, "Valor deve ser positivo");

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
    ]),
    potencia: requiredNumber,
    rendimentoBase: requiredNumber.max(100),
    rendimentoCorrigido: requiredNumber.max(100),
});

// 2. TERMOACUMULADOR
export const TermoacumuladorFormSchema = BaseFormSchema.extend({
    type: z.literal("Termoacumulador"),
    volume: requiredNumber,
    potencia: requiredNumber,
    rendimento: requiredNumber.max(100),
    temQPR: z.boolean().default(false),
    valorQPR: optionalNumber,
}).refine((data) => !data.temQPR || (data.temQPR && data.valorQPR !== undefined), {
    message: "Valor QPR é obrigatório quando QPR está marcado",
    path: ["valorQPR"],
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
    ]),
    potencia: requiredNumber,
    rendimentoBase: requiredNumber.max(100),
    rendimentoCorrigido: requiredNumber.max(100),
});

// 5. BOMBA DE CALOR
export const BombaCalorFormSchema = BaseFormSchema.extend({
    type: z.literal("Bomba de Calor"),
    energia: z.enum(["Electricidade", "Electricidade vazio", "padrão"]),
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
