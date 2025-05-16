import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
// ICONS
import { PlusIcon } from "lucide-react"
// FORM
import { ProductForm } from './product-form';
// INTERFACES
import { ProductDialogProps } from "../interfaces/product"

export function ProductDialog({actionType}: ProductDialogProps) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" >
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{actionType === "create" ? "Crear un nuevo producto" : "Editar producto"}</DialogTitle>
          <DialogDescription>
            {actionType === "create" ? "Ingresa los datos del producto" : "Edita los datos del producto"}
          </DialogDescription>
        </DialogHeader>
        <div>
          <ProductForm //actionType={actionType}
           />
        </div>          
      </DialogContent>
    </Dialog>
  )
}
