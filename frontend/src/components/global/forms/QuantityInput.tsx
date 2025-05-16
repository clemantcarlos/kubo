'use client'

import { Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { NumericFormat } from 'react-number-format'

interface QuantityInputFormFieldProps {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  label?: string
  placeholder?: string
}

export const QuantityInputFormField = ({
  name,
  control,
  label = 'Cantidad',
  placeholder = '0'
}: QuantityInputFormFieldProps) => {
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
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <NumericFormat
                  inputMode='numeric'
                  value={value}
                  thousandSeparator
                  allowNegative={false}
                  allowLeadingZeros={false}
                  decimalScale={0} // Sin decimales
                  customInput={Input}
                  getInputRef={ref}
                  onValueChange={(values) => {
                    onChange(values.floatValue ?? '')
                  }}
                  onBlur={onBlur}
                  placeholder={placeholder}
                  className="text-right font-mono"
                />
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
