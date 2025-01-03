import { Container } from "@/components/layout";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { View, Text, Image } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
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
					<View className="rounded-md size-10 items-center justify-center">
						<Avatar className="rounded-md w-10 h-10 border border-input">
							<AvatarFallback className="rounded-md w-14 h-14 border border-input">
								MA
							</AvatarFallback>
						</Avatar>
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
