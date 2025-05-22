import { Link } from 'react-router'
import { ProductDialog } from './product-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import { toast } from 'sonner'

export default function ProductActionColumn({id} : {id: number}) {
  const controller = new AbortController();

  const deleteProduct = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.PRODUCTS.BY_ID(id), {
        method: 'DELETE',
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      toast.success('Producto eliminado exitosamente');
    } catch (err) {
      if (err instanceof Error) {
        if (err.name !== 'AbortError') toast.error('No se pudo eliminar el producto');
      } else {
        toast.error("No se pudo eliminar el producto", {
        unstyled: true,
        classNames: {
          error: 'bg-red-500 flex gap-2 rounded-md p-4',
        }
      });
      }
    } finally {
      controller.abort();
    }
  };
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
                <Link to={`${id}`}>Detalles del producto</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <ProductDialog actionType="update" id={Number(id)} />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={deleteProduct}>
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
}