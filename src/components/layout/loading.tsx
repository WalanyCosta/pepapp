import { View, Image, ActivityIndicator } from "react-native";

export function LoadingComponent() {
	return (
		<View className="bg-violet-600 flex-1 items-center justify-center">
			<Image className="mb-56" source={require("@/assets/logo-white.png")} />

			<ActivityIndicator color="#fff" size={24} />
		</View>
	);
}
