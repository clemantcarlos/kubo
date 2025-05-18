import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// UI
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
// INTERFACES
import { ProductDialogProps } from "../interfaces/producDialogProps";
// UTILS
import { passwordRegex, phoneRegex } from "@/utils/contants.regex";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    })
    .max(255, {
      message: "El nombre no puede tener más de 255 caracteres.",
    }),
  email: z.string().email({
    message: "El email no es valido.",
  }),
  phoneNumber: z.string().regex(phoneRegex, {
    message: "El numero de telefono no es valido.",
  }),
  address: z
    .string()
    .min(2, {
      message: "La direccion no puede ser vacia.",
    })
    .max(255, {
      message: "La direccion no puede tener mas de 255 caracteres.",
    }),
  password: z.string().regex(passwordRegex, {
    message: "La contraseña no es valida.",
  }),
  identityDocument: z
    .string({
      required_error: "Por favor ingrese el documento de identidad.",
    })
    .min(2, {
      message: "El documento de identidad no puede ser vacio.",
    }),
  identityDocumentTypeId: z.string({
    required_error: "Por favor seleccione el tipo de documento de identidad.",
  }),
  roleId: z.string({
    required_error: "Por favor seleccione el rol.",
  }),
});

export function ProductForm({ actionType }: ProductDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      password: "",
      identityDocument: "",
      identityDocumentTypeId: "1",
      roleId: "2",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const apiData = {
      ...values,
      identityDocumentTypeId: Number(values.identityDocumentTypeId),
      roleId: Number(values.roleId),
    };
    console.log(apiData);
  }

  return (
    <Form {...form}>
      <form
        id="product-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 auto-rows-min gap-x-4 gap-y-10"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Juan Perez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormLabel className="mb-4">Documento de identidad</FormLabel>
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="identityDocumentTypeId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1"> V </SelectItem>
                      <SelectItem value="2"> J </SelectItem>
                      <SelectItem value="3"> E </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="identityDocument"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Ej: 28765432" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electronico</FormLabel>
              <FormControl>
                <Input placeholder="Ej: ejemplo@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numero de telefono</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 4125558888" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="2">Administrador</SelectItem>
                  <SelectItem value="3">Generico</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Hola.12" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ej: Calle 1 con avenida 12"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
