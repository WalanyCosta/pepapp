import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { View, Text, TouchableOpacity } from "react-native";
import { Container } from "@/components/layout";
import { ArrowLeft } from "phosphor-react-native";
import { router } from "expo-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
	Image,
	CaretRight,
	Lock,
	PaintRoller,
	SignOut,
} from "phosphor-react-native";
import { Switch } from "@/components/ui/Switch";
import { useState } from "react";

export default function Home() {
	const { setAuth } = useAuth();
	const [isEnabled, setIsEnabled] = useState(false);

	async function signOut() {
		await supabase.auth.signOut();
		setAuth(null);
	}

	function handleBack() {
		router.back();
	}

	return (
		<Container>
			<TouchableOpacity
				onPress={handleBack}
				className="w-8 h-8 mt-3 mb-5 justify-center items-start"
			>
				<ArrowLeft color="#4B5563" size={24} />
			</TouchableOpacity>

			<View className="gap-3 justify-center items-center">
				<Avatar className="rounded-md w-16 h-16 border border-input">
					<AvatarImage source={require("@/assets/logo.png")} />
					<AvatarFallback>MF</AvatarFallback>
				</Avatar>

				<View>
					<Text className="font-heading text-center text-xl mb-2">
						Marcos Ferreira
					</Text>
					<Text className="text-center text-sm text-gray-500">
						marcosferreira@mail.com
					</Text>
				</View>
			</View>

			<View className="mt-9 gap-3 justify-center ">
				<Text className="text-gray-400 text-sm ml-3">Usuario</Text>
				<View className="border border-input p-6 gap-2 rounded-md">
					<TouchableOpacity className="flex-row item-center justify-between border-b border-input py-2">
						<View className="flex-row gap-2 items-center">
							<Image color="#4B5563" size={20} />
							<Text className="text-xs text-gray-600">Alterar imagem</Text>
						</View>

						<CaretRight color="#4B5563" size={16} />
					</TouchableOpacity>

					<TouchableOpacity className="flex-row item-center justify-between border-b border-input py-2">
						<View className="flex-row gap-2 items-center">
							<Lock color="#4B5563" size={20} />
							<Text className="text-xs text-gray-600">Alterar senha</Text>
						</View>

						<CaretRight color="#4B5563" size={16} />
					</TouchableOpacity>

					<TouchableOpacity className="flex-row item-center justify-between">
						<View className="flex-row gap-2 items-center">
							<PaintRoller color="#4B5563" size={20} />
							<Text className="text-xs text-gray-600">
								Alterar tema (light/dark)
							</Text>
						</View>

						<Switch onValueChange={setIsEnabled} value={isEnabled} />
					</TouchableOpacity>
				</View>

				<TouchableOpacity className="flex-row item-center justify-between mt-5 py-2 border border-input rounded-md">
					<View className="flex-row gap-2 items-center ml-5">
						<SignOut color="#4B5563" size={20} />
						<Text className="text-xs text-gray-600">Logout</Text>
					</View>
				</TouchableOpacity>
			</View>
		</Container>
	);
}
