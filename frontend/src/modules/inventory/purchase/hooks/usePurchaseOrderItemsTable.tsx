import { useRef, useState } from "react"
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table"
// UI
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
// TYPES
import { type Product } from "../../product/types/product"
// HOOKS
import useProduct from "@/queryHooks/useProduct"
// ICONS
import { ArrowUpDown } from "lucide-react"

// Tipo para los datos de cantidad por producto
type ProductQuantity = {
  [productId: number]: number;
};

export default function usePurchaseOrderItemsTable() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [quantities, setQuantities] = useState<ProductQuantity>({})

  const [pageParam, setPageParam] = useState<number>(1)
  const [search, setSearch] = useState<string>("")

  const { useProductsQuery } = useProduct()
  const productQuery = useProductsQuery({pageParam, search})

  // Función para manejar cambios en las cantidades
  const handleQuantityChange = (productId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value, productId)
    const value = e.target.value;
    if (value !== "" && value !== "0") {
      setQuantities({
        ...quantities,
        [productId]: Number(parseInt(value))
      });
    }

    // setQuantities(prev => ({
    //   ...prev,
    //   [productId]: value === "" ? 0 : parseInt(value) || 0
    // }));
  };

  // Función para obtener los productos seleccionados con sus cantidades
  const getSelectedProducts = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    console.log(selectedRows)
    // return selectedRows.map(row => {
    //   const product = row.original;
    //   // const quantity = quantities[product.id] || 0;
    //   // return {
    //   //   ...product,
    //   //   quantity: quantity,
    //   //   totalPrice: product.price * quantity
    //   // };
    // }).filter(item => item.quantity > 0); // Solo productos con cantidad > 0
  };

  // Función para limpiar cantidades cuando se deselecciona una fila
  const handleRowSelectionChange = (updaterOrValue: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => {
    const newSelection = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue;
    setRowSelection(newSelection);
    
    // Limpiar cantidades de productos deseleccionados
    const selectedIds = Object.keys(newSelection).filter(key => newSelection[key]);
    setQuantities(prev => {
      const newQuantities = { ...prev };
      Object.keys(newQuantities).forEach(productId => {
        if (!selectedIds.includes(productId)) {
          delete newQuantities[parseInt(productId)];
        }
      });
      return newQuantities;
    });
  };

  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-right">Cantidad</div>,
      cell: ({ row }) => {
        const productId = row.original.id;
        return (
          <Input 
            inputMode="numeric" 
            // value={quantities[productId] || ""}
            onChange={(e) => handleQuantityChange(productId, e)}
            placeholder="0"
          />
        );
      },
    },
    {
      accessorKey: "price",
      header: () => <div className="text-right">Precio</div>,
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"))

        // Format the price as a dollar price
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price)

        return <div className="text-right font-medium">{formatted}</div>
      },
    },
  ]

  const table = useReactTable({
    data: productQuery.data?.products || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    // sorting
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // pagination
    getPaginationRowModel: getPaginationRowModel(),
    // row selection
    onRowSelectionChange: handleRowSelectionChange,
    state: {
      sorting,
      rowSelection,
    },
  })

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
    columns,
    handleInputChange,
    setPageParam,
    getSelectedProducts, // Nueva función para obtener productos seleccionados
    quantities, // Estado de cantidades
  }
}