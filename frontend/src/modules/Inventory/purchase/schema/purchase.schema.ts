import { phoneRegex } from "@/utils/contants.regex"
import { z } from "zod"
export const formSchema = z.object({
  name: z.string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    })
    .max(255, {
      message: "El nombre no puede tener más de 255 caracteres.",
    }),
  email: z.string().email().optional(),
  phone: z.string().regex(phoneRegex).optional(),
  address: z.string()
    .min(2,{
      message: "La dirección no puede ser vacía.",
    })
    .max(255, {
      message: "La dirección no puede tener más de 255 caracteres.",
    })
    .optional(),
  taxId: z.string().optional(),
  isActive: z.boolean(),
})

export type PurchaseFormSchema = z.infer<typeof formSchema>
