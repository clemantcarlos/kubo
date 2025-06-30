import { passwordRegex } from "@/utils/contants.regex"
import { z } from "zod"
export const formSchema = z.object({
  email: z.string()
    .email({
      message: "Por favor ingrese un correo electrónico válido.",
    }),
  password: z.string()
  .regex(passwordRegex, {
    message: "La contraseña debe tener al menos 8 caracteres y contener al menos una letra mayúscula, una letra minúscula, un número y un caracter especial.",
  })
})

export type LoginFormSchema = z.infer<typeof formSchema>