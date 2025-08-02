import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// ICONS
import { PlusIcon } from "lucide-react";
// FORM
import { ProductForm } from "./product-form";
// INTERFACES
import { ProductDialogProps } from "../interfaces/producDialogProps";

export function ProductDialog({ actionType, id }: ProductDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        { actionType === "create" ?
          <Button variant="outline">
            <PlusIcon />
          </Button>
          : <span>Editar producto</span>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {actionType === "create"
              ? "Crear un nuevo producto"
              : "Editar producto"}
          </DialogTitle>
          <DialogDescription>
            {actionType === "create"
              ? "Ingresa los datos del producto"
              : "Edita los datos del producto"}
          </DialogDescription>
        </DialogHeader>
        <div>
          <ProductForm actionType={actionType} id={id}/>
        </div>
      </DialogContent>
    </Dialog>
  );
}
