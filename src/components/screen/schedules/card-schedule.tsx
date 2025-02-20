import { View, Text } from "react-native";
import { Clock } from "phosphor-react-native";
import {
	IconOptionAction,
	OptionAction,
	OptionRoot,
} from "@/components/layout/options/Option";
import { OptionViewSchedule } from "@/components/screen/schedules/option-view";
import type { OrderItem } from "@/models/order-item";
import { Fragment, useMemo } from "react";
import { Badge, type VariantsProps } from "@/components/ui/badge";
import { OrderStatus, type Order } from "@/models/order";
import { convertDateOtherFormat } from "@/utils/convert-date-other-format";
import { formatItems } from "@/utils/fomat-Items";
import { formatTime } from "@/utils/format-time";

type CardScheduleProps = {
	order: Order;
	orderItems: OrderItem[];
	onAction: () => void;
	onEdit: () => void;
};

export function CardSchedule({
	order,
	orderItems,
	onAction,
	onEdit,
}: CardScheduleProps) {
	const renderItems = useMemo(() => {
		return formatItems(orderItems);
	}, [orderItems]);

	return (
		<View className="justify-center gap-4 mb-3 p-3 border border-input rounded-md">
			<View className="flex-1 relative">
				<View className="w-full flex-row justify-between items-start">
					<Text className="font-heading text-xl mb-2">
						Data: {convertDateOtherFormat(order.created_at)}
					</Text>
					<OptionRoot>
						<OptionViewSchedule order={order} />
						{(order.status === OrderStatus.PENDING ||
							order.status === OrderStatus.CANCEL) && (
							<Fragment>
								<OptionAction
									title="Cancelar"
									icon={IconOptionAction.CANCEL}
									onAction={onAction}
								/>
								<OptionAction
									title="editar"
									icon={IconOptionAction.EDIT}
									onAction={onEdit}
								/>
							</Fragment>
						)}
					</OptionRoot>
				</View>
				<Text className="text-base text-gray-400">{renderItems}</Text>
			</View>

			<View className="bg-red-200 rounded-md border-l-2 border-primary flex-row items-center justify-between p-2">
				<View className="flex-row gap-1 items-center">
					<Clock color="#4B5563" size={20} />
					<Text className="text-base text-gray-600">
						{formatTime(order.created_at)}
					</Text>
				</View>

				<Badge text={order.status as VariantsProps} />
			</View>
		</View>
	);
}
