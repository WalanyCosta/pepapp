import { View, Text, Image, TouchableOpacity } from "react-native";
import {
	ShirtFolded,
	Boot,
	HardHat,
	ArrowsInCardinal,
} from "phosphor-react-native";
import { useState } from "react";

type IconProps = "all" | "Boot" | "HardHat" | "ShirtFolded";

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
	onPress: () => void;
};

export function CategoryItem({
	icon,
	name,
	isActive,
	setIsActive,
	onPress,
}: Props) {
	function handleCategoryItem() {
		setIsActive(name);
		onPress();
	}

	return (
		<TouchableOpacity
			onPress={handleCategoryItem}
			className={`gap-2 px-3 py-2 ${isActive === name ? "bg-violet-600" : "border border-input"} flex-row rounded-md justify-center items-center`}
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
