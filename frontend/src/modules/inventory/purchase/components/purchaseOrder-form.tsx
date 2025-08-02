// UI
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// HOOKS
import usePurchaseForm from "../hooks/usePurchaseForm";
// INTERFACES
import { DialogProps } from "../interfaces/dialogProps";
// ICONS
import { CalendarIcon, Check, ChevronsUpDown, Save, User } from "lucide-react";
// UTILS
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import PurchaseOrderItemsTable from "./purchaseOrder-items-table";

export function PurchaseForm({ actionType, id }: DialogProps) {
  const {
    form,
    formValues,
    // DATA
    suppliers,
    user,
    // FUNCTIONS
    onCreate,
    onUpdate,
  } = usePurchaseForm(id);

  return (
    <Form {...form}>
      <Tabs defaultValue="account">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="form">Formulario</TabsTrigger>
            <TabsTrigger value="items">Productos/Servicios</TabsTrigger>
          </TabsList>
          <Button 
            variant="secondary" 
            size="icon" 
            type = 'submit'
            onClick={
              actionType === "update" && id
                ? form.handleSubmit(onUpdate)
                : form.handleSubmit(onCreate)
            }
          >
            <Save />
          </Button>
        </div>
        <TabsContent className="min-h-80" value="form">
          <form
            id="supplier-form"
            className="grid grid-cols-2 auto-rows-min gap-x-4 gap-y-10"
          >
            <Badge>
              <User />
              {user?.name}
            </Badge>
            <span aria-label="just space"></span>
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Proveedor</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? suppliers.find(
                                (supplier) => supplier.id === field.value
                              )?.name
                            : "Selecciona un proveedor"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search framework..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No hay resultados.</CommandEmpty>
                          <CommandGroup>
                            {suppliers &&
                              suppliers.length > 0 &&
                              suppliers.map((supplier) => (
                                <CommandItem
                                  value={supplier.name}
                                  key={supplier.id}
                                  onSelect={() =>
                                    form.setValue("supplierId", supplier.id)
                                  }
                                >
                                  {supplier.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      supplier.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expectedDeliveryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de entrega (estimada)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Elige una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={es}
                        lang="es"
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      className={
                        form.getValues("notes") !== formValues.notes && id
                          ? "resize-none border-amber-500 focus-visible:ring-amber-500"
                          : "resize-none"
                      }
                      placeholder="Ej: 2 cajas de..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </TabsContent>
        <TabsContent className="min-h-80" value="items">
         <PurchaseOrderItemsTable />
        </TabsContent>
      </Tabs>
    </Form>
  );
}
