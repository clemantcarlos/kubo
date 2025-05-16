import {
  ColumnDef,
  // ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRef, useState } from "react";
import { ProductDialog } from "./product-dialog";
 
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}
 
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]) 
  const [globalFilter, setGlobalFilter] = useState<string>("")
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
    onGlobalFilterChange: setGlobalFilter
  })

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  
  
  const handleSearch = (value: string) => {
    table.setGlobalFilter(String(value))
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

  return (
    <div>
      <div className="flex items-center justify-between py-4 gap-4">
        <Input
          placeholder="Busca producto..."
          onChange={handleInputChange}
          className="max-w-sm"
        />
        <ProductDialog  actionType="create" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}