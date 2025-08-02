// TABLE
import { ColumnDef } from "@tanstack/react-table";
// UI
import { Badge } from "@/components/ui/badge";
// TYPES
import { Purchase } from "../types/purchase.type";
// ACTION COLUMN
import PurchaseActionColumn from "./purchaseOrder-action-column";
// COMPONENTS
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router";
// TODO: MAKE DETAIL PAGE FOR USER AND SUPPLIER
export const columns: ColumnDef<Purchase>[] = [
  {
    accessorKey: "orderNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nº Orden
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const orderNumber = row.original.orderNumber;
      return (
        <span className="ml-2">{orderNumber}</span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.original.history[0].status;
      return (
        <div className="flex items-center gap-2">
          <Badge variant = 'secondary'
            className = {
              status === 'PENDING' ? ' bg-amber-300 dark:text-accent'
              : status === 'APPROVED' ? 'bg-green-300 dark:text-accent'
              : status === 'RECEIVED' ? ''
              : status === 'CANCELLED' ? 'text-red-300 dark:text-accent'
              : ''
            }
          >
            { 
              status === 'PENDING' ? 'PENDIENTE' 
              : status === 'APPROVED' ? 'APROBADO' 
              : status === 'RECEIVED' ? 'RECIBIDO' 
              : status === 'CANCELLED' ? 'CANCELADO' 
              : '-'
            }
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'notes',
    header: 'Nota',
    cell: ({ row }) => {
      const notes = row.original.history[0].notes;
      return (
        <span className="text-sm">
          {notes ?? <Badge variant = 'outline' className="w-full">-</Badge>}
        </span>
      );
    },
  },
  {
    header: 'Comprador',
    cell: ({ row }) => {
      const { id, name } = row.original.history[0].user; 
      return (
        <Link to={`/user/${id}`}>{name}</Link>
      );
    },
  },
  {
    header: 'Proveedor',
    cell: ({ row }) => {
      const { id, name } = row.original.supplier; 
      return (
        <Link to={`/supplier/${id}`}>{name}</Link>
      );
    },
  },
  {
    header: 'Costo Total',
    cell: ({ row }) => {
      const amount = row.original.totalAmount;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Acciones</div>,
    cell: ({ row }) => {
      const id = row.original.id
      return <PurchaseActionColumn id={id} />; 
    },
  },
];
