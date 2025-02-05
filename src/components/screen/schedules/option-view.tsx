import { OptionView } from "@/components/layout/options/Option";
import { Badge, type VariantsProps } from "@/components/ui/badge";
import type { Order } from "@/models/order";
import { View, Text, Image, FlatList } from "react-native";

type OptionViewScheduleProps = {
	order: Order;
};

export function OptionViewSchedule({ order }: OptionViewScheduleProps) {
	return (
		<OptionView>
			<View className="w-96 gap-3">
				<View className="w-32">
					<Text className="font-heading text-xl mb-2">Detalhes</Text>
					<Badge text={order.status as VariantsProps} />
				</View>

				<View className="mt-3 gap-3 justify-center">
					<View className="gap-1 justify-center">
						<Text className="text-xl font-heading">Descrisão de tamanho</Text>
						<Text className="text-base text-gray-500">
							{order.sizeDescription}
						</Text>
					</View>
					<View className="gap-1 justify-center">
						<Text className="text-xl font-heading">Motivos da solicitação</Text>
						<Text className="text-base text-gray-500">{order.ranson}</Text>
					</View>
				</View>

				<View className="mt-3 gap-3 justify-center">
					<View className="gap-3 justify-center">
						<Text className="text-xl font-heading">Items solicitados</Text>

						<FlatList
							className="gap-2 mb-3 h-32"
							keyExtractor={(item) => item.id.toString()}
							data={order.order_items}
							renderItem={({ item }) => (
								<View className="flex-row items-center gap-3">
									<Image
										className="w-14 h-14"
										source={require("@/assets/fotos-uniformes.jpg")}
									/>

									<View className="gap-1 w-60 pb-2 pr-4">
										<Text className="text-base font-heading">
											{item.items.name}
										</Text>
										<Text className="text-base text-wrap text-gray-500">
											{item.items.description}
										</Text>
									</View>
								</View>
							)}
							contentContainerClassName="items-start gap-2 pb-8 flex-1"
							showsVerticalScrollIndicator={false}
						/>
					</View>
				</View>
			</View>
		</OptionView>
	);
}
