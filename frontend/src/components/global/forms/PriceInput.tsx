import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { NumericFormat } from "react-number-format";
import { ProductFormSchema } from "@/modules/Inventory/product/schema/product.schema";

interface PriceInputFormFieldProps {
  disabled?: boolean;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label?: string;
  placeholder?: string;
  formValues?: ProductFormSchema;
}

export const PriceInputFormField = ({
  formValues,
  disabled,
  name,
  control,
  label = "Precio",
  placeholder = "$0.00",
}: PriceInputFormFieldProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={() => (
        <FormItem>
          {label && <Label>{label}</Label>}
          <FormControl>
            <Controller
              name={name}
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => {
                let currentValue = value;
                return (
                  <NumericFormat
                    disabled={disabled}
                    inputMode="numeric"
                    value={value}
                    thousandSeparator
                    prefix="$"
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}z
                    customInput={Input}
                    getInputRef={ref}
                    onValueChange={(values) => {
                      onChange(values.floatValue ?? "");
                      currentValue = values.floatValue ?? "";
                    }}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={
                      Number(formValues?.price) === Number(currentValue)
                        ? "text-right font-mono"
                        : "text-right font-mono border-amber-500 focus-visible:ring-amber-500"
                    }
                  />
                );
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
