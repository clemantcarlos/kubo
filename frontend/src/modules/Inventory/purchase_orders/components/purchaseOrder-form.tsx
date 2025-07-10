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
import {PriceInputFormField} from "@/components/global/forms/PriceInput"
import { QuantityInputFormField } from "@/components/global/forms/QuantityInput"
// HOOKS
import useProductForm from "../hooks/useProductForm"
// ICONS
import { PlusIcon } from "lucide-react"
// INTERFACES
import { ProductCategory } from "../interfaces/productCategory"
import { StorageUnit } from "../interfaces/storageUnit"
import { ProductDialogProps } from "../interfaces/producDialogProps"

export function ProductForm({ actionType, id }: ProductDialogProps) {  
  const { 
    form, 
    formValues, 
    categories, 
    storageUnits, 
    onCreate, 
    onUpdate, 
  } = useProductForm(id)

  return (
    <Form {...form}>
      <form id = 'product-form'
        onSubmit = {  
          actionType === "update" && id
          ? form.handleSubmit(onUpdate) 
          : form.handleSubmit(onCreate)
        } 
        className="grid grid-cols-2 auto-rows-min gap-x-4 gap-y-10">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input 
                  className = {
                    form.getValues("name") !== formValues.name && id ?
                    "border-amber-500 focus-visible:ring-amber-500"
                    : ""
                  } 
                  placeholder="Ej: Harina pan" {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="flex flex-wrap gap-2">
              <FormLabel className="w-full">Categoría</FormLabel>
              <Select  onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="flex-1">
                    <SelectValue
                      className = {
                        form.getValues("categoryId") !== formValues.categoryId && id ?
                        "border-amber-500 focus-visible:ring-amber-500"
                        : ""
                      }
                      placeholder="Selecciona una categoría"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.length > 0 && categories?.map((category: ProductCategory) => (
                    <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button  variant = 'outline' className="col-auto" onClick={(e)=>e.preventDefault()}>
                <PlusIcon />
              </Button>
              <FormMessage  className="col-span-2"/>
            </FormItem>
          )}
        />
       <FormField
        
        control={form.control}
        name="storageUnitId"
        render={({ field }) => (
          <FormItem className="flex flex-wrap gap-2f">
            <FormLabel className="w-full">Unidad de almacenamiento</FormLabel>
            <Select  onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="flex-1">
                  <SelectValue 
                    className = {
                      form.getValues("storageUnitId") !== formValues.storageUnitId && id ?
                      "border-amber-500 focus-visible:ring-amber-500"
                      : ""
                    }
                    placeholder="Selecciona una unidad" 
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {storageUnits.length > 0 && storageUnits?.map((storageUnit: StorageUnit) => (
                  <SelectItem key={storageUnit.id} value={String(storageUnit.id)}>{storageUnit.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button  variant = 'outline' className="col-auto" onClick={(e)=>e.preventDefault()}>
                <PlusIcon />
              </Button>
            <FormMessage />
          </FormItem>
        )}
      />
        <QuantityInputFormField
          formValues={formValues}
          name="stock" 
          control={form.control} 
        />
        <PriceInputFormField  
          formValues = {formValues}
          name="price" 
          control={form.control}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen</FormLabel>
              <FormControl>
                <Input  type="file"  accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    field.onChange(file)
                  }
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea 
                  className = {
                    form.getValues("description") !== formValues.description && id ?
                    "resize-none border-amber-500 focus-visible:ring-amber-500"
                    : "resize-none"
                  }
                  placeholder="Ej: Harina de maiz precocida" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* {form.watch("image") instanceof File && (
          <img
            src={URL.createObjectURL(form.watch("image"))}
            alt="Preview"
            className="w-24 h-24 object-cover rounded"
          />
        )} */}
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

