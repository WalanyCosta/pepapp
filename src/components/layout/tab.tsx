import { View, TouchableOpacity, Text } from "react-native";
import { type IconName, IconSystem } from "./icon-system";

function Tab({ children }: { children: React.ReactNode }) {
	return (
		<View className="fixed bottom-20 gap-6 bg-violet-600 py-1 px-2 flex-row items-center justify-center z-50 rounded-md">
			{children}
		</View>
	);
}

type TabScreenProps = {
	icon: IconName;
	badge?: boolean;
	badgeNumber?: number;
	textBadge?: string;
	onPress: () => void;
	active: string;
	setActive: (active: string) => void;
};

function TabScreen({
	icon,
	active = "House",
	badge = false,
	badgeNumber = 0,
	textBadge,
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
			className={`w-14 h-14 relative items-center justify-center ${active === icon && "bg-white rounded-full"}`}
		>
			{badge && badgeNumber > 0 && (
				<View className="bg-white w-7 h-7 py-2 overflow-hidden flex-row justify-center items-center absolute rounded-full top-1 left-8 z-10">
					<View className="mx-auto flex-row justify-center items-center">
						<Text className="text-xs text-violet-600 flex-row justify-center items-center">
							{badgeNumber}
						</Text>
					</View>
				</View>
			)}

			<IconSystem
				icon={icon}
				size={32}
				color="#fff"
				colorActive="#7c3aed"
				active={active}
			/>
		</TouchableOpacity>
	);
}

export { Tab, TabScreen };
