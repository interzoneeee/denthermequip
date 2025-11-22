import fs from "fs/promises";
import path from "path";
import { Equipment } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "equipments.json");

async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

async function readData(): Promise<Equipment[]> {
    await ensureDataDir();
    try {
        const data = await fs.readFile(DATA_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is invalid, return empty array
        return [];
    }
}

async function writeData(data: Equipment[]) {
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function getAllEquipments(): Promise<Equipment[]> {
    return readData();
}

export async function getEquipmentById(id: string): Promise<Equipment | undefined> {
    const equipments = await readData();
    return equipments.find((eq) => eq.id === id);
}

export async function saveEquipment(equipment: Equipment): Promise<void> {
    const equipments = await readData();
    const index = equipments.findIndex((eq) => eq.id === equipment.id);

    if (index >= 0) {
        equipments[index] = equipment;
    } else {
        equipments.push(equipment);
    }

    await writeData(equipments);
}

export async function removeEquipment(id: string): Promise<void> {
    const equipments = await readData();
    const filtered = equipments.filter((eq) => eq.id !== id);
    await writeData(filtered);
}
