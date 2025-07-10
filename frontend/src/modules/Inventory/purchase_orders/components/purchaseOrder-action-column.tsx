// COMPONENTS
import { ProductDialog } from "./purchaseOrder-dialog";
// import Product from '../../pages/Product';
import Alert from "@/components/global/messages/Alert";
// UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// ICONS
import { MoreHorizontal } from "lucide-react";
import useGlobal from "@/hooks/useGlobal";

export default function ProductActionColumn({ id }: { id: number }) {
  const { deleteProduct } = useGlobal();

  const deleteConfirmHandler = async () => {
    await deleteProduct(id);
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
          {/* <DropdownMenuItem disabled = {true} onSelect={(e) => e.preventDefault()}>
            <Product id={Number(id)} />
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <ProductDialog actionType="update" id={Number(id)} />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Alert
              trigger="Eliminar producto"
              title="¿Estás seguro de eliminar este producto?"
              description="Esta acción no se puede deshacer!"
              onConfirm={deleteConfirmHandler}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
