import type { ReactNode } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function Container({ children }: { children: ReactNode }) {
	return (
		<SafeAreaView className="flex-1 bg-white font-body text-gray-800">
			<ScrollView>
				<View className="mx-7">{children}</View>
			</ScrollView>
		</SafeAreaView>
	);
}
