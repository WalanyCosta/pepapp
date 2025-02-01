import { Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import {
	IconOptionDelete,
	OptionDelete,
	OptionRoot,
} from "../layout/options/Option";
import { formatItems } from "@/utils/fomat-Items";
import { Clock } from "phosphor-react-native";
import { formatTime } from "@/utils/format-time";
import { Badge } from "../ui/badge";
import { type Order, OrderStatus } from "@/models/order";

type Props = {
	item: Order;
	handleUpdateOrdersStatus: (id: string, orderStatus: OrderStatus) => void;
};

export function CardOrder({ item, handleUpdateOrdersStatus }: Props) {
	return (
		<View className="justify-center mb-3 p-3 border border-input rounded-md">
			<View className="flex-1">
				<View className="w-full flex-row justify-between items-start mb-3">
					<View className="flex-row items-center gap-3">
						<Avatar className="w-12 h-12">
							{item.users.image ? (
								<AvatarImage
									className=""
									source={{
										uri: item.users.image,
									}}
								/>
							) : (
								<AvatarFallback textClassname="text-base">pq</AvatarFallback>
							)}
						</Avatar>

						<Text className="font-heading text-xl">{item.users.name}</Text>
					</View>

					<OptionRoot>
						<OptionDelete
							title="Negar"
							icon={IconOptionDelete.DENY}
							onRemove={() =>
								handleUpdateOrdersStatus(item.id, OrderStatus.DENIED)
							}
						/>
						<OptionDelete
							title="Aceitar"
							icon={IconOptionDelete.ACCEPT}
							onRemove={() => {
								handleUpdateOrdersStatus(item.id, OrderStatus.ACCEPTED);
							}}
						/>
					</OptionRoot>
				</View>
				<Text className="ml-3 mb-5 text-base text-gray-400">
					{formatItems(item.order_items)}
				</Text>
			</View>

			<View className="bg-violet-200 rounded-md border-l-2 border-violet-600 flex-row items-center justify-between p-2">
				<View className="flex-row gap-1 items-center">
					<Clock color="#4B5563" size={24} />
					<Text className="text-base text-gray-600">
						{formatTime(item.created_at)}
					</Text>
				</View>

				<Badge text={item.status} />
			</View>
		</View>
	);
}
