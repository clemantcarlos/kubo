// UI
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// COMPONENTS
import { PurchaseOrderDialog } from "../purchase/components/purchaseOrder-dialog";
// HOOKS
import usePurchase from "../purchase/hooks/usePurchaseTable";
// TABLE
import { flexRender } from "@tanstack/react-table";
import { columns } from "../purchase/components/purchaseOrder-columns";

export default function Purchases() {
  const { table, handleInputChange, pageParam, setPageParam, totalPages } =
    usePurchase();
  return (
    <div className="container mx-auto p-10">
      <div className="flex items-center justify-between py-4 gap-4">
        <Input
          placeholder="Busca orden de compra..."
          onChange={handleInputChange}
          className="max-w-sm"
        />
        <PurchaseOrderDialog actionType="create" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
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
          onClick={() => setPageParam(pageParam - 1)}
          disabled={pageParam === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {pageParam} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageParam(pageParam + 1)}
          disabled={pageParam === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
