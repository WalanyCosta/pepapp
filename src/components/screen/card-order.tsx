import { Image, Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import {
	IconOptionAction,
	OptionAction,
	OptionRoot,
	OptionView,
} from "../layout/options/Option";
import { formatItems } from "@/utils/fomat-Items";
import { Clock } from "phosphor-react-native";
import { formatTime } from "@/utils/format-time";
import { Badge, type VariantsProps } from "../ui/badge";
import { type Order, OrderStatus } from "@/models/order";
import { FlatList } from "react-native-gesture-handler";
import { verifyImageUri } from "@/utils/verify-image-uri";

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
						<OptionAction
							title="Negar"
							icon={IconOptionAction.DENY}
							onAction={() =>
								handleUpdateOrdersStatus(item.id, OrderStatus.DENIED)
							}
						/>
						<OptionAction
							title="Aceitar"
							icon={IconOptionAction.ACCEPT}
							onAction={() => {
								handleUpdateOrdersStatus(item.id, OrderStatus.ACCEPTED);
							}}
						/>

						<OptionView>
							<View className="w-96 gap-3">
								<View className="w-32">
									<Text className="w-72 font-heading text-xl mb-2">
										{item.users.name}
									</Text>
									<Badge text={item.status as VariantsProps} />
								</View>

								<View className="mt-3 gap-3 justify-center">
									<View className="gap-1 justify-center">
										<Text className="text-xl font-heading">
											Descrisão de tamanho
										</Text>
										<Text className="text-base text-gray-500">
											{item.sizeDescription}
										</Text>
									</View>
									<View className="gap-1 justify-center">
										<Text className="text-xl font-heading">
											Motivos da solicitação
										</Text>
										<Text className="text-base text-gray-500">
											{item.ranson}
										</Text>
									</View>
								</View>

								<View className="mt-3 gap-3 justify-center">
									<View className="gap-3 justify-center">
										<Text className="text-xl font-heading">
											Items solicitados
										</Text>

										<FlatList
											className="gap-2 mb-3"
											keyExtractor={(item) => item.id.toString()}
											data={item.order_items}
											renderItem={({ item }) => (
												<View className="flex-row items-center gap-3">
													<Image
														className="w-14 h-14"
														source={verifyImageUri(item.items.image)}
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
											contentContainerStyle={{
												paddingBottom: 32,
												gap: 8,
												alignItems: "flex-start",
											}}
											showsVerticalScrollIndicator={false}
										/>
									</View>
								</View>
							</View>
						</OptionView>
					</OptionRoot>
				</View>
				<Text className="ml-3 mb-5 text-base text-gray-400">
					{formatItems(item.order_items)}
				</Text>
			</View>

			<View className="bg-red-200 rounded-md border-l-2 border-primary flex-row items-center justify-between p-2">
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
