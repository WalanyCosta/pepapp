import { View, Text, Image, TouchableOpacity } from "react-native";
import { Icon, type IconName } from "./icon-component";

type Props = {
	icon: IconName;
	name: string;
	isActive: string;
	setIsActive: (active: string) => void;
};

export function CategoryItem({ icon, name, isActive, setIsActive }: Props) {
	function handleCategoryItem() {
		setIsActive(icon);
	}

	return (
		<TouchableOpacity
			onPress={handleCategoryItem}
			className={`mr-2 px-4 py-3 flex-row gap-2 rounded-md justify-center items-center ${isActive === icon ? "bg-violet-600" : "border border-input"} `}
		>
			<Icon
				name={icon}
				color={isActive === icon ? "#FFF" : "#4B5563"}
				size={20}
			/>
			<Text
				className={`${isActive === icon ? "text-white" : "text-gray-800"} text-base`}
			>
				{name}
			</Text>
		</TouchableOpacity>
	);
}
