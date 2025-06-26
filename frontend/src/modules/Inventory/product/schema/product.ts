import { z } from "zod"
export const formSchema = z.object({
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
  }),
  image: z.any()
    .refine((file) => file instanceof File || file?.length > 0)
    .optional()
})

export type ProductFormSchema = z.infer<typeof formSchema>
