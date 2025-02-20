import { View, Image, ActivityIndicator } from "react-native";

export function LoadingComponent() {
	return (
		<View className="bg-background h-full items-center">
			<View className="h-[40rem] mt-80">
				<Image
					className="mb-96"
					source={require("@/assets/roger-technology.png")}
				/>

				<ActivityIndicator className="" color="#f87171" size={32} />
			</View>
		</View>
	);
}
