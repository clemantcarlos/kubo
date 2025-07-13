import { useEffect, useRef, useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import useGlobal from "@/hooks/useGlobal";
import { columns } from "../components/supplier-columns";

export default function useProduct() {
  // HOOKS
  const { supplier } = useGlobal();
  const { value, methods } = supplier;
  const { getSuppliers  } = methods;
  //STATES
  const [page, setPage] = useState<number>(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  // REFS
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    getSuppliers(page, searchQuery)
  }, [getSuppliers, page, searchQuery]);

  // TABLE
  const table = useReactTable({
    data: value.data || [],
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

  const handleSearch = (value: string) => {
    setPage(1);
    setSearchQuery(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Cancela el timer anterior cada vez que escribes
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const value = e.target.value;
    // 2. Inicia un nuevo timer
    timerRef.current = setTimeout(() => {
      handleSearch(value);
    }, 500); // Espera 500ms DESPUÉS de la última tecla presionada
  };

  return {
    table,
    handleInputChange,
    data: value.data || [],
    totalPages: value?.meta?.totalPages || 0,
    page,
    setPage,
  };
}
