import { useEffect, useRef, useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import useGlobal from "@/hooks/useGlobal";
import { columns } from "../components/purchaseOrder-columns";

export default function useProduct() {
  // HOOKS
  const { getProducts, product } = useGlobal();
  //STATES
  const [page, setPage] = useState<number>(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  // REFS
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    getProducts(page, searchQuery);
  }, [getProducts, page, searchQuery]);

  // TABLE
  const table = useReactTable({
    data: product.data || [],
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
    data: product.data || [],
    totalPages: product?.meta?.totalPages || 0,
    page,
    setPage,
  };
}
