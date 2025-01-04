import { View, Text, Image, TouchableOpacity } from "react-native";
import {
	ShirtFolded,
	Boot,
	HardHat,
	ArrowsInCardinal,
} from "phosphor-react-native";
import { useState } from "react";

export type IconProps = "all" | "Boot" | "HardHat" | "ShirtFolded";

function CategoryItemIcon({ icon, active }: { icon: string; active: boolean }) {
	if (icon === "ShirtFolded") {
		return <ShirtFolded color={active ? "#FFF" : "#4B5563"} size={20} />;
	}

	if (icon === "HardHat") {
		return <HardHat color={active ? "#FFF" : "#4B5563"} size={20} />;
	}

	if (icon === "Boot") {
		return <Boot color={active ? "#FFF" : "#4B5563"} size={20} />;
	}

	return <ArrowsInCardinal color={active ? "#FFF" : "#4B5563"} size={20} />;
}
type Props = {
	icon?: IconProps;
	name: string;
	isActive: string;
	setIsActive: (active: string) => void;
};

export function CategoryItem({ icon, name, isActive, setIsActive }: Props) {
	function handleCategoryItem() {
		setIsActive(name);
	}

	return (
		<TouchableOpacity
			onPress={handleCategoryItem}
			className={`mr-2 px-3 py-2 flex-row gap-2 rounded-md justify-center items-center ${isActive === name ? "bg-violet-600" : "border border-input"} `}
		>
			<CategoryItemIcon icon={icon ?? "all"} active={isActive === name} />
			<Text
				className={`${isActive === name ? "text-white" : "text-gray-800"} text-sm`}
			>
				{name}
			</Text>
		</TouchableOpacity>
	);
}
