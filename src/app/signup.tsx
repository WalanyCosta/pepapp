import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
	return (
		<SafeAreaView className="flex-1 bg-white font-body text-gray-800">
			<View className="bg-red-500">
				<Text className="">Hello react native</Text>
			</View>
		</SafeAreaView>
	);
}
