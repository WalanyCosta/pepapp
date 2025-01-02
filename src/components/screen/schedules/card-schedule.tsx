import { View, Text } from "react-native";
import { Clock } from "phosphor-react-native";
import { OptionDelete, OptionRoot } from "@/components/layout/options/Option";
import { OptionViewSchedule } from "@/components/screen/schedules/option-view";

export function CardSchedule() {
	return (
		<View className="justify-center gap-4 mb-3 p-3 border border-input rounded-md">
			<View className="flex-row justify-between items-start pr-3 relative">
				<View>
					<Text className="font-heading text-base mb-2">Data: 07/03/2024</Text>
					<Text className="text-sm text-gray-400">
						As solitações foram: botas, t-shirt, e capacete.
					</Text>
				</View>

				<OptionRoot>
					<OptionViewSchedule />
					<OptionDelete title="cancelar" icon="CANCEL" onRemove={() => {}} />
				</OptionRoot>
			</View>

			<View className="bg-violet-200 rounded-md border-l-2 border-violet-600 flex-row items-center justify-between p-2">
				<View className="flex-row gap-1 items-center">
					<Clock color="#4B5563" size={16} />
					<Text className="text-sm text-gray-600">10:00 AM</Text>
				</View>

				<View className="bg-yellow-50 p-1 flex-row rounded-md border border-yellow-500">
					<Text className="text-xs text-yellow-500">Aguardando</Text>
				</View>
			</View>
		</View>
	);
}
