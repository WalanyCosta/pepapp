import { Controller, type UseControllerProps } from "react-hook-form";
import { Input, type InputProps } from "../ui/Input";
import clsx from "clsx";
import { View, Text } from "react-native";
import { forwardRef } from "react";
import type { TextInput } from "react-native";

type InputControlProps = {
	formProps: UseControllerProps;
	inputProps: InputProps;
	error: string;
	inputClassName?: string;
};

export const InputControl = forwardRef<TextInput, InputControlProps>(
	({ formProps, inputProps, error, inputClassName }, ref) => {
		return (
			<View className="w-full gap-2">
				<Controller
					render={({ field }) => (
						<Input
							onChangeText={field.onChange}
							labelClasses="text-base font-heading text-gray-800"
							inputClasses={`text-base text-gray-800 w-full ${clsx(
								{
									["border-border-red"]: error.length > 0,
									["border-primary"]: error.length === 0 && field.value,
									["border-input"]: error.length === 0 && !field.value,
								},
								inputClassName,
							)}`}
							onBlur={field.onBlur}
							value={field.value}
							ref={ref}
							{...inputProps}
						/>
					)}
					{...formProps}
				/>

				{error.length > 0 && (
					<Text className="text-sm font-body text-border-red">{error}</Text>
				)}
			</View>
		);
	},
);
