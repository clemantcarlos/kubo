import { ColumnDef } from "@tanstack/react-table"

export interface DataTableProps<TData, TValue> {
  isLoading: boolean
  totalPages: number
  page: number
  onPageChange: (page: number) => void
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}