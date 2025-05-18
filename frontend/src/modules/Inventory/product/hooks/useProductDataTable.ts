import { useRef, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { DataTableProps } from "../interfaces/dataTabeProps";

type Props<TData, TValue> = Pick<
  DataTableProps<TData, TValue>,
  "columns" | "data"
>;

export default function useProduct<TData, TValue>({
  columns,
  data,
}: Props<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // pagination
    getPaginationRowModel: getPaginationRowModel(),
    // sorting
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // filters
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "auto",
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleSearch = (value: string) => {
    table.setGlobalFilter(String(value));
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
  };
}
