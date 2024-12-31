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

export default function Home() {
	const { setAuth } = useAuth();

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
				<View className="gap-2 px-3 bg-violet-600 flex-row rounded-md justify-center items-center">
					<ArrowsInCardinal color="#FFF" size={24} />
					<Text className="text-white text-sm">Todas</Text>
				</View>

				<View className="gap-2 px-3 py-1 flex-row rounded-md justify-center items-center border border-input">
					<ShirtFolded color="#4B5563" size={24} />
					<Text className="text-sm">Roupas</Text>
				</View>

				<View className="gap-2 px-3 py-1 flex-row rounded-md justify-center items-center border border-input">
					<ShirtFolded color="#4B5563" size={24} />
					<Text className="text-sm">Roupas</Text>
				</View>

				<View className="gap-2 px-3 py-1 flex-row rounded-md justify-center items-center border border-input">
					<ShirtFolded color="#4B5563" size={24} />
					<Text className="text-sm">Roupas</Text>
				</View>
			</View>

			<View className="gap-2">
				<View className="flex-row gap-4 px-2 py-3 border border-input rounded-md">
					<Image
						className="w-16 h-16"
						source={require("@/assets/fotos-uniformes.jpg")}
					/>
					<View className="gap-1 w-64">
						<Text className="text-base font-heading">T-shirt padrão</Text>
						<Text className="text-sm text-wrap">
							Lorem ipsum dolor sit amet consectetur adipisicing elit
						</Text>
					</View>
				</View>

				<View className="flex-row gap-4 px-2 py-3 border border-input rounded-md">
					<Image
						className="w-16 h-16"
						source={require("@/assets/ilustration.png")}
					/>
					<View className="gap-1 w-64">
						<Text className="text-base font-heading">T-shirt padrão</Text>
						<Text className="text-sm text-wrap">
							Lorem ipsum dolor sit amet consectetur adipisicing elit
						</Text>
					</View>
				</View>

				<View className="flex-row gap-4 px-2 py-3 border border-input rounded-md">
					<Image
						className="w-16 h-16"
						source={require("@/assets/fotos-uniformes.jpg")}
					/>
					<View className="gap-1 w-64">
						<Text className="text-base font-heading">T-shirt padrão</Text>
						<Text className="text-sm text-wrap">
							Lorem ipsum dolor sit amet consectetur adipisicing elit
						</Text>
					</View>
				</View>
			</View>
		</Container>
	);
}
