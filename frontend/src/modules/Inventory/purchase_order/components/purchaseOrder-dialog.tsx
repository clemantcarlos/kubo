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
import { PurchaseOrderForm } from "./purchaseOrder-form";
// INTERFACES
import { DialogProps } from "../interfaces/dialogProps";

export function PurchaseOrderDialog({ actionType, id }: DialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        { actionType === "create" ?
          <Button variant="outline">
            <PlusIcon />
          </Button>
          : <span>Editar Proveedor</span>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {actionType === "create"
              ? "Crear un nuevo proveedor"
              : "Editar proveedor"}
          </DialogTitle>
          <DialogDescription>
            {actionType === "create"
              ? "Ingresa los datos del proveedor"
              : "Edita los datos del proveedor"}
          </DialogDescription>
        </DialogHeader>
        <div>
          <PurchaseOrderForm actionType={actionType} id={id}/>
        </div>
      </DialogContent>
    </Dialog>
  );
}
