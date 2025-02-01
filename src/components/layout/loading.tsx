import { View, Image, ActivityIndicator } from "react-native";

export function LoadingComponent() {
	return (
		<View className="bg-violet-600 h-full items-center">
			<View className="h-[40rem] mt-80">
				<Image className="mb-96" source={require("@/assets/logo-white.png")} />

				<ActivityIndicator className="" color="#fff" size={32} />
			</View>
		</View>
	);
}
