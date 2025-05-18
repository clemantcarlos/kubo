import pluralize from '@/lib/pluralize'
// TABLE
import { ColumnDef } from "@tanstack/react-table"
// ICONS
import { MoreHorizontal, ArrowUpDown} from "lucide-react"
//  COMPONENTS
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// TYPES
import { Product } from '../types/product'
import { Link } from 'react-router'
import { ProductDialog } from './product-dialog'

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: 'Nombre'
  },
  {
    accessorKey: "description",
    header: 'Descripción',
  },
  {
    accessorKey: "isAvailable",
    header: 'Disponibilidad ',
    cell: ({ row }) => {
      const isAvailable = row.getValue("isAvailable")
      if(isAvailable === false) return <Badge variant = 'destructive' className='items-end'>No disponible</Badge>
      return <Badge className="self-end">Disponible</Badge>
    },
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-right">Stock</div>,
    cell: ({ row }) => {
      const stock = parseInt(row.getValue("stock"))
      const storageUnit = row.original.storageUnit
      return <div className="text-right">{`
        ${stock} ${stock > 1 ? pluralize(storageUnit.name) : storageUnit.name}
      `}</div>
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Precio</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "category.name",
    header: () => <div className="text-right">Categoría</div>,
    cell: ({ row }) => {
      const category = row.original.category
      return <div className="text-right">{category.name}</div>
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Acciones</div>,
    cell: ({ row }) => {
      const productId: string = row.getValue("id")  
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link to={`${productId}`}>Detalles del producto</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <ProductDialog actionType="update" id={Number(productId)} />
              </DropdownMenuItem>
              <DropdownMenuItem>Eliminar Producto</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    
  },
  
]