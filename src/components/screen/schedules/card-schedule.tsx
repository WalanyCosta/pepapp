import { View, Text } from "react-native";
import { Clock } from "phosphor-react-native";
import {
	IconOptionDelete,
	OptionDelete,
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
import { supabase } from "@/lib/supabase";

type CardScheduleProps = {
	order: Order;
	orderItems: OrderItem[];
	onRemove: () => void;
	onEdit: () => void;
};

export function CardSchedule({
	order,
	orderItems,
	onRemove,
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
								<OptionDelete
									title="Cancelar"
									icon={IconOptionDelete.CANCEL}
									onRemove={onRemove}
								/>
								<OptionDelete
									title="editar"
									icon={IconOptionDelete.EDIT}
									onRemove={onEdit}
								/>
							</Fragment>
						)}
					</OptionRoot>
				</View>
				<Text className="text-base text-gray-400">{renderItems}</Text>
			</View>

			<View className="bg-violet-200 rounded-md border-l-2 border-violet-600 flex-row items-center justify-between p-2">
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
