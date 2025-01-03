import { View, TouchableOpacity } from "react-native";
import { House, ListPlus, CalendarCheck, GearSix } from "phosphor-react-native";
import { type IconName, IconSystem } from "./icon-system";

function Tab({ children }: { children: React.ReactNode }) {
	return (
		<View className="fixed -bottom-[38%] gap-6 bg-violet-600 mx-2 py-1 px-2 flex-row items-center justify-center z-50 rounded-md">
			{children}
		</View>
	);
}

type TabScreenProps = {
	icon: IconName;
	onPress: () => void;
	active: string;
	setActive: (active: string) => void;
};

function TabScreen({
	icon,
	active = "House",
	setActive,
	onPress,
}: TabScreenProps) {
	function handlePress() {
		setActive(icon);
		onPress();
	}

	return (
		<TouchableOpacity
			onPress={handlePress}
			className={`w-12 h-12 items-center justify-center ${active === icon && "bg-white rounded-full"}`}
		>
			<IconSystem
				icon={icon}
				size={24}
				color="#fff"
				colorActive="#7c3aed"
				active={active}
			/>
		</TouchableOpacity>
	);
}

export { Tab, TabScreen };
