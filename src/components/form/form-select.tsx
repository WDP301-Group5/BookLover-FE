import { type ComboboxData, Select } from "@mantine/core";
import { Controller, type FieldValues } from "react-hook-form";
import type { FormFieldProps } from "./form-type";

type FormSelectProps<T extends FieldValues> = FormFieldProps<T> & {
	options: ComboboxData;
	label?: string;
	placeholder?: string;
	disabled?: boolean;
};

// Inside your component
export function FormSelect<T extends FieldValues>({
	control,
	name,
	options,
	label,
	placeholder,
	disabled,
}: FormSelectProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Select
					{...field}
					label={label}
					placeholder={placeholder}
					data={options}
					error={fieldState.error?.message}
					disabled={disabled}
				/>
			)}
		/>
	);
}
