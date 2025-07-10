// TABLE
import { ColumnDef } from "@tanstack/react-table";
// UI
import { Badge } from "@/components/ui/badge";
// TYPES
import { Supplier } from "../types/supplier.type";
// ACTION COLUMN
import SupplierActionColumn from "./supplier-action-column";
export const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "address",
    header: "Dirección",
  },
  {
    accessorKey: "isActive",
    header: "Disponibilidad",
    cell: ({ row }) => {
      const isAvailable = row.getValue("isActive");
      if (isAvailable === false)
        return (
          <Badge variant="destructive" className="items-end">
            No disponible
          </Badge>
        );
      return <Badge className="self-end">Disponible</Badge>;
    },
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: "actions",
    header: () => <div className="text-right">Acciones</div>,
    cell: ({ row }) => {
      const supplierId = row.original.id
      return <SupplierActionColumn id={Number(supplierId)} />;
    },
  },
];
