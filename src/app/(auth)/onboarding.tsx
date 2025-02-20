import { Button } from "@/components/ui/Button";
import { View, Text, Image } from "react-native";
import { router } from "expo-router";
import { Container } from "@/components/layout/container";

export default function Onboarding() {
	return (
		<Container>
			<Image
				className="mt-5 mr-5"
				source={require("@/assets/roger-technology-mini.png")}
			/>

			<Image
				className="self-center mt-16 w-80 h-80"
				source={require("@/assets/wishes-amico.png")}
			/>

			<View className="justify-center items-center gap-4 mt-24">
				<Text className="font-heading text-2xl text-center text-gray-800">
					Faça o seu pedido de forma facil e eficaz
				</Text>
				<Text className="text-base text-center text-gray-500 w-96">
					Pressione o botão a baixo para iniciar a o usar o teu génio
				</Text>
			</View>

			<Button
				isLoading={false}
				className="mt-20 mb-12"
				label="Começar"
				size={"lg"}
				variant={"default"}
				onPress={() => router.replace("/(auth)/signin")}
			/>
		</Container>
	);
}
