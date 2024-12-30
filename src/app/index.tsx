import { Button } from "@/components/ui/Button";
import { View, Text, Image } from "react-native";
import { router } from "expo-router";
import { Container } from "@/components/layout/container";

export default function Home() {
	return (
		<Container>
			<Image className="mt-5 mr-5" source={require("@/assets/mini-logo.png")} />

			<Image
				className="self-center mt-16"
				source={require("@/assets/ilustration.png")}
			/>

			<View className="justify-center items-center gap-2 mt-11">
				<Text className="font-heading text-xl text-center text-gray-800">
					Lorem ipsum is simply dummy text of the printing
				</Text>
				<Text className="text-sm text-center">
					Lorem ipsum is simply dummy text of the printing
				</Text>
			</View>

			<Button
				isLoading={false}
				className="mt-16 mb-12"
				label="Começar"
				size={"default"}
				variant={"default"}
				onPress={() => router.replace("/signin")}
			/>
		</Container>
	);
}
