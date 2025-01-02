import { Container } from "@/components/layout";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { TouchableOpacity, View, Text, Image, Pressable } from "react-native";
import {
	ArrowLeft,
	Clock,
	DotsThree,
	Calendar,
	Eye,
	Trash,
	PencilLine,
} from "phosphor-react-native";
import { router } from "expo-router";
import DateTimePicker from "react-native-ui-datepicker";
import { useState } from "react";
import dayjs from "dayjs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import "dayjs/locale/pt";
import { OptionDelete, OptionRoot } from "@/components/layout/options/Option";
import { OptionViewSchedule } from "@/components/screen/schedules/option-view";

export default function Schedule() {
	const { setAuth } = useAuth();
	const [date, setDate] = useState(dayjs());
	const [saveDate, setSaveDate] = useState<Date | null>(null);

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

			<View className="justify-center mb-8">
				<Image className="mb-5" source={require("@/assets/mini-logo.png")} />
				<Text className="font-heading text-xl">Agenda de solicitações</Text>
			</View>

			<View className="flex-row mb-4 items-center relative">
				<Dialog>
					<DialogTrigger>
						<TouchableOpacity className="flex-row items-center gap-2 py-2 px-2 border border-input rounded-md">
							<Calendar color="#4B5563" size={20} />
							<Text className="text-xs text-gray-600">
								{saveDate === null
									? "Seleciona a data"
									: dayjs(saveDate).format("DD/MM/YYYY").toString()}
							</Text>
						</TouchableOpacity>
					</DialogTrigger>
					<DialogContent>
						<View className="w-4/5 h-96">
							<DateTimePicker
								mode="single"
								date={date}
								onChange={(params: any) => {
									setDate(params.date);
									setSaveDate(params.date);
								}}
								locale={dayjs.locale("pt")}
							/>
						</View>
					</DialogContent>
				</Dialog>
			</View>

			<View>
				<View className="justify-center gap-4 mb-3 p-3 border border-input rounded-md">
					<View className="flex-row justify-between items-start pr-3 relative">
						<View>
							<Text className="font-heading text-base mb-2">
								Data: 07/03/2024
							</Text>
							<Text className="text-sm text-gray-400">
								As solitações foram: botas, t-shirt, e capacete.
							</Text>
						</View>

						<OptionRoot>
							<OptionViewSchedule />

							<OptionDelete
								title="cancelar"
								icon="CANCEL"
								onRemove={() => {}}
							/>
						</OptionRoot>
					</View>

					<View className="bg-violet-200 rounded-md border-l-2 border-violet-600 flex-row items-center justify-between p-2">
						<View className="flex-row gap-1 items-center">
							<Clock color="#4B5563" size={16} />
							<Text className="text-sm text-gray-600">10:00 AM</Text>
						</View>

						<View className="bg-yellow-50 p-2 flex-row rounded-md border border-yellow-500">
							<Text className="text-xs text-yellow-500">Aguardando</Text>
						</View>
					</View>
				</View>

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

						<View className="bg-green-50 p-2 flex-row rounded-md border border-green-500">
							<Text className="text-xs text-green-500">Aceite</Text>
						</View>
					</View>
				</View>
			</View>
		</Container>
	);
}
