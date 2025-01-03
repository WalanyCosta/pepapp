import { TouchableOpacity, View, Text, Image } from "react-native";
import { Container } from "@/components/layout";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Clock } from "phosphor-react-native";
import { useState } from "react";
import { Calendar } from "@/components/layout/calendar";
import { router } from "expo-router";
import { CardSchedule } from "@/components/screen/schedules/card-schedule";

export default function Schedule() {
	const { setAuth } = useAuth();
	const [saveDate, setSaveDate] = useState<Date | null>(null);

	async function signOut() {
		await supabase.auth.signOut();
		setAuth(null);
	}

	function handleBack() {
		router.replace("/(employee)/home");
	}

	return (
		<Container>
			<TouchableOpacity
				onPress={handleBack}
				className="w-8 h-8 mt-3 mb-5 justify-center items-start"
			>
				<ArrowLeft color="#4B5563" size={24} />
			</TouchableOpacity>

			<View className="justify-center mb-8">
				<Image className="mb-5" source={require("@/assets/mini-logo.png")} />
				<Text className="font-heading text-xl">Agenda de solicitações</Text>
			</View>

			<Calendar saveDate={saveDate} setSaveDate={setSaveDate} />

			<View>
				<CardSchedule />
				<CardSchedule />
				<View className="justify-center gap-4 mb-3 p-3 border border-input rounded-md">
					<View className="flex-row justify-between items-start pr-3">
						<View>
							<Text className="font-heading text-base mb-2">
								Data: 07/03/2024
							</Text>
							<Text className="text-sm text-gray-400">
								As solitações foram: botas, t-shirt, e capacete.
							</Text>
						</View>
					</View>

					<View className="bg-violet-200 rounded-md border-l-2 border-violet-600 flex-row items-center justify-between p-2">
						<View className="flex-row gap-1 items-center">
							<Clock color="#4B5563" size={16} />
							<Text className="text-sm text-gray-600">10:00 AM</Text>
						</View>

						<View className="bg-green-50 p-1 flex-row rounded-md border border-green-500">
							<Text className="text-xs text-green-500">Aceite de sucesso</Text>
						</View>
					</View>
				</View>
			</View>
		</Container>
	);
}
