
import { EquipmentSchema } from "./src/lib/types";

const validAC = {
    id: "123",
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    type: "Ar Condicionado",
    marca: "Daikin",
    modelo: "Perfera",
    potenciaArrefecimento: 3.5,
    potenciaAquecimento: 4.0,
};

const result = EquipmentSchema.safeParse(validAC);

if (result.success) {
    console.log("Validation SUCCESS");
} else {
    console.log("Validation FAILED");
    console.log(JSON.stringify(result.error.format(), null, 2));
}

const validEsquentador = {
    id: "124",
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    type: "Esquentador",
    marca: "Vulcano",
    modelo: "Click",
    energia: "Gás Natural",
    potencia: 20,
    rendimentoBase: 90,
    rendimentoCorrigido: 88,
};

const result2 = EquipmentSchema.safeParse(validEsquentador);
if (result2.success) {
    console.log("Esquentador Validation SUCCESS");
} else {
    console.log("Esquentador Validation FAILED");
    console.log(JSON.stringify(result2.error.format(), null, 2));
}
