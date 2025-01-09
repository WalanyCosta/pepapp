import { View, Text } from "react-native";
import { Clock } from "phosphor-react-native";
import { OptionDelete, OptionRoot } from "@/components/layout/options/Option";
import { OptionViewSchedule } from "@/components/screen/schedules/option-view";
import type { OrderItem } from "@/models/order-item";
import { useMemo } from "react";
import { Badge, type VariantsProps } from "@/components/ui/badge";
import type { Order } from "@/models/order";
import { convertDateOtherFormat } from "@/utils/convert-date-other-format";
import { formatTime } from "@/utils/format-time";

type CardScheduleProps = {
	order: Order;
	orderItems: OrderItem[];
	onRemove: () => void;
};

export function CardSchedule({
	order,
	orderItems,
	onRemove,
}: CardScheduleProps) {
	const renderItems = useMemo(() => {
		const itemNames = orderItems.map((orderItem) => orderItem.items.name);

		if (itemNames.length === 0) {
			return;
		}

		const formattedItems = itemNames.join(", ").replace(/,([^,]*)$/, " e$1");
		return `Os pedidos foram: ${formattedItems}`;
	}, [orderItems]);

	return (
		<View className="justify-center gap-4 mb-3 p-3 border border-input rounded-md">
			<View className="flex-1 relative">
				<View className="w-full flex-row justify-between items-start">
					<Text className="font-heading text-base mb-2">
						Data: {convertDateOtherFormat(order.date)}
					</Text>
					<OptionRoot>
						<OptionViewSchedule order={order} />
						<OptionDelete title="cancelar" icon="CANCEL" onRemove={onRemove} />
					</OptionRoot>
				</View>
				<Text className="text-sm text-gray-400">{renderItems}</Text>
			</View>

			<View className="bg-violet-200 rounded-md border-l-2 border-violet-600 flex-row items-center justify-between p-2">
				<View className="flex-row gap-1 items-center">
					<Clock color="#4B5563" size={16} />
					<Text className="text-sm text-gray-600">
						{formatTime(order.created_at)}
					</Text>
				</View>

				<Badge text={order.status as VariantsProps} />
			</View>
		</View>
	);
}
