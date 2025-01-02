import { Container } from "@/components/layout";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { View, Text, Image } from "react-native";
import {
	ShirtFolded,
	Boot,
	HardHat,
	ArrowsInCardinal,
} from "phosphor-react-native";
import { CardItem } from "@/components/layout/card-item";
import { CategoryItem } from "@/components/layout/category-item";
import { useState } from "react";

export default function Home() {
	const { setAuth } = useAuth();
	const [isActive, setIsActive] = useState("Todos");

	async function signOut() {
		await supabase.auth.signOut();
		setAuth(null);
	}

	return (
		<Container>
			<Image
				className="mt-6 mb-10"
				source={require("@/assets/mini-logo.png")}
			/>
			<View className="gap-1 mb-12 justify-center">
				<View className="flex-row justify-between items-center">
					<Text className="font-heading text-2xl">Olá Marcos 👋</Text>
					<View className="bg-gray-400 rounded-md size-10 items-center justify-center">
						<Text className="text-base text-center text-white font-heading">
							MA
						</Text>
					</View>
				</View>
				<Text className="text-sm text-gray-500">
					Lorem ipsum is simply dummy text of te printing
				</Text>
			</View>
			<View className="gap-2 mb-8 flex-row">
				<CategoryItem
					name="Todos"
					icon="all"
					onPress={() => {}}
					isActive={isActive}
					setIsActive={setIsActive}
				/>

				<CategoryItem
					name="Roupas"
					icon="ShirtFolded"
					onPress={() => {}}
					isActive={isActive}
					setIsActive={setIsActive}
				/>

				<CategoryItem
					name="Calçados"
					icon="Boot"
					onPress={() => {}}
					isActive={isActive}
					setIsActive={setIsActive}
				/>

				<CategoryItem
					name="Accessorios de trabalho"
					icon="HardHat"
					onPress={() => {}}
					isActive={isActive}
					setIsActive={setIsActive}
				/>
			</View>

			<View className="gap-2">
				<CardItem
					source={require("@/assets/fotos-uniformes.jpg")}
					title="T-shirt padrão"
					description="Lorem ipsums dolor sit amet consectetur adipisicing elit"
				/>
			</View>
		</Container>
	);
}
