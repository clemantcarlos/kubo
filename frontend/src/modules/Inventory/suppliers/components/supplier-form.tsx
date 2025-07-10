// UI
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,  
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// UI
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// COMPONENTS
import { PriceInputFormField } from "@/components/global/forms/PriceInput"
import { QuantityInputFormField } from "@/components/global/forms/QuantityInput"
// HOOKS
import useSupplierForm from "../hooks/useSupplierForm"
// ICONS
import { PlusIcon } from "lucide-react"
// INTERFACES
import { ProductCategory } from "../interfaces/productCategory"
import { StorageUnit } from "../interfaces/storageUnit"
import { DialogProps } from "../interfaces/dialogProps"

export function ProductForm({ actionType, id }: DialogProps) {  
  const { 
    form, 
    formValues, 
    categories, 
    storageUnits, 
    onCreate, 
    onUpdate, 
  } = useSupplierForm(id)

  return (
    <Form {...form}>
      <form id = 'product-form'
        onSubmit = {  
          actionType === "update" && id
          ? form.handleSubmit(onUpdate) 
          : form.handleSubmit(onCreate)
        } 
        className="grid grid-cols-2 auto-rows-min gap-x-4 gap-y-10">
      <Button 
        className="col-span-2" 
        type="submit"
        >
        {actionType === "create" ? "Agregar" : "Editar"}
        </Button>
      </form>
    </Form>
  )
}

