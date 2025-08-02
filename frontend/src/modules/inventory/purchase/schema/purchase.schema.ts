import { z } from "zod"
export const formSchema = z.object({
  supplierId: z.string().min(1).uuid(),
  expectedDeliveryDate: z.date(),
  notes: z.string().min(1),
  // items: z.array(
  //   z.object({
  //     productId: z.string().min(1).uuid(),
  //     quantity: z.number().min(1),
  //     unitPrice: z.number().min(1),
  //     subtotal: z.number().min(1),
  //   })
  // ),
})

export type PurchaseFormSchema = z.infer<typeof formSchema>
