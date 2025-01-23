import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { cn } from "../../lib/utils";

// TODO: make controlled (optional)
interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof View> {
	label?: string;
	name: string;
	filter: string;
	setFilter: (filter: string) => void;
	labelClasses?: string;
	checkboxClasses?: string;
}
function Checkbox({
	label,
	labelClasses,
	checkboxClasses,
	className,
	filter,
	setFilter,
	name,
	...props
}: CheckboxProps) {
	const [isChecked, setChecked] = useState(false);

	const toggleCheckbox = () => {
		setChecked((prev) => !prev);
		if (name !== filter) {
			setFilter(name);
			return;
		}
		setFilter("");
	};

	return (
		<View
			className={cn("flex flex-row items-center gap-2", className)}
			{...props}
		>
			<TouchableOpacity onPress={toggleCheckbox}>
				<View
					className={cn(
						"w-5 h-5 border border-input rounded bg-background flex justify-center items-center",
						{
							"bg-primary": filter === name,
						},
						checkboxClasses,
					)}
				>
					{filter === name && (
						<Text className="text-background text-xs">✓</Text>
					)}
				</View>
			</TouchableOpacity>
			{label && (
				<Text className={cn("text-gray-800 capitalize", labelClasses)}>
					{label}
				</Text>
			)}
		</View>
	);
}

export { Checkbox };
