import { ColumnDef } from "@tanstack/react-table"
// TODO: THIS INTERFACE SHOULD BE GLOBAL TO ALL THE TABLES
export interface DataTableProps<TData, TValue> {
  totalPages: number
  page: number
  setPage: (page: number) => void
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}