import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
// UI
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,  FormField,
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {PriceInputFormField} from "@/components/global/forms/PriceInput"
import { QuantityInputFormField } from "@/components/global/forms/QuantityInput"
import { API_ENDPOINTS } from "@/lib/api/endpoints"
// INTERFACES
// import { ProductDialogProps } from "../interfaces/product"

const formSchema = z.object({
  name: z.string()
  .min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  })
  .max(255, {
    message: "El nombre no puede tener más de 255 caracteres.",
  }),
  description: z.string()
  .min(2, {
    message: "La descripción debe tener al menos 2 caracteres.",
  })
  .max(255, {
    message: "La descripción no puede tener más de 255 caracteres.",
  }),
  stock: z.number().min(1, {
    message: "El stock debe ser mayor a 1.",
  }),
  price: z.number({
    required_error: "Por favor ingrese el precio."
  }),
  storageUnitId: z.string({
    required_error: "Por favor seleccione la unidad de almacenamiento.",
  }),
  categoryId: z.string({
    required_error: "Por favor seleccione la categoría.",
  }) 
})

const getCategories = async () => {
  const response = await fetch(API_ENDPOINTS.PRODUCT_CATEGORIES.BASE)
  const data = await response.json()
  return data
}

const getStorageUnits = async () => {
  const response = await fetch(API_ENDPOINTS.PRODUCT_STORAGE_UNITS.BASE)
  const data = await response.json()
  return data
}

export function ProductForm(
  // {actionType}: ProductDialogProps
) { 
  const [categories, setCategories] = useState([])
  const [storageUnits, setStorageUnits] = useState([])
 
  useEffect(()=>{
    getCategories().then((data) => { setCategories(data)})
    getStorageUnits().then((data) => { setStorageUnits(data)})
  },[])


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      stock: 1,
      price: 0,
      storageUnitId: '1',
      categoryId: '2',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const apiData = {
      ...values,
      storageUnitId: Number(values.storageUnitId),
      categoryId: Number(values.categoryId),
      price: Number(values.price),
    };
    console.log(apiData)
  }

  return (
    <Form {...form}>
      <form id = 'product-form' onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 auto-rows-min gap-x-4 gap-y-10">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Harina pan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoría</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={String(field.value)} >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="storageUnitId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unidad de almacenamiento</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={String(field.value)} >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una unidad" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {storageUnits?.map((storageUnit) => (
                  <SelectItem key={storageUnit.id} value={String(storageUnit.id)}>{storageUnit.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
        <QuantityInputFormField name="stock" control={form.control} />
        <PriceInputFormField name="price" control={form.control} />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea className="rezize-none" placeholder="Ej: Harina de maiz precocida" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      <Button className="col-span-2" type="submit">Continuar</Button>
      </form>
    </Form>
  )
}

