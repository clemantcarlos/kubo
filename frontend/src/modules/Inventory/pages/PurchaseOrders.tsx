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
import { ProductDialog } from "../purchase_orders/components/purchaseOrder-dialog";
// HOOKS
import useProduct from "../purchase_orders/hooks/useProduct";
// TABLE
import { flexRender } from "@tanstack/react-table";
import { columns } from "../purchase_orders/components/purchaseOrder-columns";

export default function PurchaseOrders() {
  const { table, handleInputChange, page, setPage, totalPages } = useProduct();
  return (
    <div className="container mx-auto p-10">
      <div className="flex items-center justify-between py-4 gap-4">
        <Input
          placeholder="Busca orden de compra..."
          onChange={handleInputChange}
          className="max-w-sm"
        />
        <ProductDialog actionType="create" />
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
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {page} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
