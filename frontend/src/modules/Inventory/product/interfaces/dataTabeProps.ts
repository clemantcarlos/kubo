import { ColumnDef } from "@tanstack/react-table"

export interface DataTableProps<TData, TValue> {
  totalPages: number
  page: number
  setPage: (page: number) => void
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}