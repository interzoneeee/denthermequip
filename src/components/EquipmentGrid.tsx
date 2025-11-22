import { getEquipments } from "@/actions/equipment";
import { EquipmentList } from "./EquipmentList";
import { Pagination } from "./Pagination";

export async function EquipmentGrid({
    query,
    type,
    page,
}: {
    query: string;
    type: string;
    page: number;
}) {
    const { equipments, totalPages, currentPage } = await getEquipments(query, type, page);

    return (
        <div className="space-y-8">
            <EquipmentList equipments={equipments} />
            <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
    );
}
