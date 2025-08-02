import { useRef, useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "../components/purchaseOrder-columns";
import usePurchase from "@/queryHooks/usePurchase";

export default function usePurchaseTable() {
  //STATES
  const [pageParam, setPageParam] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  // HOOKS
  const { usePurchaseOrdersQuery } = usePurchase();
  const purchaseOrderQuery = usePurchaseOrdersQuery({ pageParam, search });
  const [sorting, setSorting] = useState<SortingState>([]);
  // REFS
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // TABLE
  const table = useReactTable({
    data: purchaseOrderQuery.data?.purchaseOrders || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    // pagination
    getPaginationRowModel: getPaginationRowModel(),
    // sorting
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Cancela el timer anterior cada vez que escribes
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const value = e.target.value;
    // 2. Inicia un nuevo timer
    timerRef.current = setTimeout(() => {
      setPageParam(1);
      setSearch(value);
    }, 500); // Espera 500ms DESPUÉS de la última tecla presionada
  };

  return {
    table,
    totalPages: purchaseOrderQuery.data?.meta.totalPages || 0,
    pageParam,
    handleInputChange,
    setPageParam,
  };
}
