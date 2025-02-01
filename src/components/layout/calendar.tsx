import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import "dayjs/locale/pt";
import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "phosphor-react-native";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { convertDateOtherFormat } from "@/utils/convert-date-other-format";

type Props = {
	saveDate: Date | null;
	setSaveDate: (data: Date) => void;
};

export function Calendar({ saveDate, setSaveDate }: Props) {
	const [date, setDate] = useState(dayjs());

	return (
		<View className="flex-row mb-10 items-center relative">
			<Dialog>
				<DialogTrigger>
					<TouchableOpacity className="flex-row items-center gap-2 py-2 px-4 border border-input rounded-md">
						<CalendarIcon color="#4B5563" size={24} />
						<Text className="text-base text-gray-600">
							{saveDate === null
								? "Seleciona a data"
								: convertDateOtherFormat(saveDate)}
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
								setSaveDate(new Date(params.date));
							}}
							locale={dayjs.locale("pt-br")}
						/>
					</View>
				</DialogContent>
			</Dialog>
		</View>
	);
}
