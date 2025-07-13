import type { Control, FieldValues, Path } from "react-hook-form";

import type { InputProps } from "../atom";
import { Input } from "../atom";
import { FormControl, FormField, FormItem, FormMessage } from "./base";

export interface FormInputProps<T extends FieldValues = FieldValues>
  extends InputProps {
  name: Path<T>;
  control: Control<T>;
}

export function FormInput<T extends FieldValues = FieldValues>({
  control,
  name,
  ...props
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
