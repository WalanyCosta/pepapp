import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import "dayjs/locale/pt";
import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "phosphor-react-native";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";

type Props = {
	saveDate: Date | null;
	setSaveDate: (data: Date) => void;
};

export function Calendar({ saveDate, setSaveDate }: Props) {
	const [date, setDate] = useState(dayjs());

	return (
		<View className="flex-row mb-4 items-center relative">
			<Dialog>
				<DialogTrigger>
					<TouchableOpacity className="flex-row items-center gap-2 py-2 px-2 border border-input rounded-md">
						<CalendarIcon color="#4B5563" size={20} />
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
	);
}
