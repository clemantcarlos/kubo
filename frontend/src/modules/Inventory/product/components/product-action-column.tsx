// COMPONENTS
import { ProductDialog } from './product-dialog'
import Product from '../../pages/Product';
import Alert from '@/components/global/messages/Alert';
// UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
// ICONS
import { MoreHorizontal } from 'lucide-react'
// API
import { API_ENDPOINTS } from '@/lib/api/endpoints'

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
          <DropdownMenuItem disabled = {true} onSelect={(e) => e.preventDefault()}>
            <Product id={Number(id)} />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <ProductDialog actionType="update" id={Number(id)} />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Alert 
              trigger='Eliminar producto'
              title='¿Estás seguro de eliminar este producto?'
              description='Esta acción no se puede deshacer!'
              onConfirm={deleteProduct}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}