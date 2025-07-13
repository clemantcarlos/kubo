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
// UI
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// HOOKS
import usePurchaseOrderForm from "../hooks/usePurchaseOrderForm";
// INTERFACES
import { DialogProps } from "../interfaces/dialogProps";

export function PurchaseOrderForm({ actionType, id }: DialogProps) {
  const { form, formValues, onCreate, onUpdate } =
    usePurchaseOrderForm(id);

  return (
    <Form {...form}>
      <form
        id="supplier-form"
        onSubmit={
          actionType === "update" && id
            ? form.handleSubmit(onUpdate)
            : form.handleSubmit(onCreate)
        }
        className="grid grid-cols-2 auto-rows-min gap-x-4 gap-y-10"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input
                  className={
                    form.getValues("name") !== formValues.name && id
                      ? "border-amber-500 focus-visible:ring-amber-500"
                      : ""
                  }
                  placeholder="Ej: Distribuidora..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefóno</FormLabel>
              <FormControl>
                <Input
                  className={
                    form.getValues("phone") !== formValues.phone && id
                      ? "border-amber-500 focus-visible:ring-amber-500"
                      : ""
                  }
                  placeholder="Ej: 4125555555"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electronico</FormLabel>
              <FormControl>
                <Input
                  className={
                    form.getValues("email") !== formValues.email && id
                      ? "border-amber-500 focus-visible:ring-amber-500"
                      : ""
                  }
                  placeholder="Ej: distribuidora@gmail.com"
                  {...field}
                />
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
                  className = {
                    form.getValues("address") !== formValues.address && id ?
                    "resize-none border-amber-500 focus-visible:ring-amber-500"
                    : "resize-none"
                  }
                  placeholder="Ej: Calle 123, 123 123"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="col-span-2" type="submit">
          {actionType === "create" ? "Agregar" : "Editar"}
        </Button>
      </form>
    </Form>
  );
}
