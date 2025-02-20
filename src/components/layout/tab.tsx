import { View, TouchableOpacity, Text } from "react-native";
import { type IconName, IconSystem } from "./icon-system";
import clsx from "clsx";
import { type Href, Link } from "expo-router";

function Tab({
	children,
	className,
}: { children: React.ReactNode; className?: string }) {
	return (
		<View
			className={clsx(
				"fixed bottom-20 gap-6 bg-red-500 py-1 px-2 flex-row items-center justify-center z-50 rounded-md",
				className,
			)}
		>
			{children}
		</View>
	);
}

type TabScreenRouteProps = {
	icon: IconName;
	badge?: boolean;
	badgeNumber?: number;
	textBadge?: string;
	onPress: () => void;
	active: string;
	setActive: (active: string) => void;
};

function TabScreenRoute({
	icon,
	active = "House",
	badge = false,
	badgeNumber = 0,
	textBadge,
	setActive,
	onPress,
}: TabScreenRouteProps) {
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
						<Text className="text-xs text-primary flex-row justify-center items-center">
							{badgeNumber}
						</Text>
					</View>
				</View>
			)}

			<IconSystem
				icon={icon}
				size={32}
				color="#fff"
				colorActive="#dc2626"
				active={active}
			/>
		</TouchableOpacity>
	);
}

type TabScreenProps = {
	icon: IconName;
	badge?: boolean;
	badgeNumber?: number;
	textBadge?: string;
	active: string;
	routeRef?: Href;
	setActive: (active: string) => void;
};

function TabScreen({
	icon,
	active = "House",
	badge = false,
	badgeNumber = 0,
	textBadge,
	setActive,
	routeRef,
}: TabScreenProps) {
	return (
		<Link href={routeRef || "/(employee)/home"}>
			<View
				className={`w-14 h-14 relative items-center justify-center ${active === icon && "bg-white rounded-full"}`}
			>
				{badge && badgeNumber > 0 && (
					<View className="bg-white w-7 h-7 py-2 overflow-hidden flex-row justify-center items-center absolute rounded-full top-1 left-8 z-10">
						<View className="mx-auto flex-row justify-center items-center">
							<Text className="text-xs text-red-600 flex-row justify-center items-center">
								{badgeNumber}
							</Text>
						</View>
					</View>
				)}

				<IconSystem
					icon={icon}
					size={32}
					color="#fff"
					colorActive="#dc2626"
					active={active}
				/>
			</View>
		</Link>
	);
}

export { Tab, TabScreen, TabScreenRoute };
