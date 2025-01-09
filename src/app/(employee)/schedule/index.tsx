import { TouchableOpacity, View, Text, Image } from "react-native";
import { Container } from "@/components/layout";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "phosphor-react-native";
import { Fragment, useEffect, useState } from "react";
import { Calendar } from "@/components/layout/calendar";
import { router } from "expo-router";
import { CardSchedule } from "@/components/screen/schedules/card-schedule";
import { OrderStatus, type Order } from "@/models/order";
import { FlatList } from "react-native-gesture-handler";
import { CardScheduleEmpty } from "@/components/screen/schedules/card-schedule-empty";
import { Alert } from "react-native";

export default function Schedule() {
	const { user } = useAuth();
	const [refresh, setRefresh] = useState(false);
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(false);
	const [saveDate, setSaveDate] = useState<Date | null>(null);

	function handleBack() {
		router.replace("/(employee)/home");
	}

	const fetchItems = async () => {
		let response: any;
		setLoading(true);

		if (saveDate === null) {
			response = await supabase
				.from("orders")
				.select("*, order_items!inner(*, items(*))")
				.eq("userId", user?.id);
		} else {
			response = await supabase
				.from("orders")
				.select("*, order_items!inner(*, items!inner(*))")
				.eq("userId", user?.id)
				.eq("date", saveDate);
		}

		if (response.error) {
			setLoading(false);
			Alert.alert("Error do sistema", response.error.message);
			return;
		}

		setOrders(response.data);
		setLoading(false);
	};

	async function handleCancelOrder(order: Order) {
		if (order.status === OrderStatus.CANCEL) {
			return;
		}

		const { error } = await supabase
			.from("orders")
			.update({ status: OrderStatus.CANCEL })
			.eq("id", order.id);

		if (error) {
			Alert.alert("Error", "Ocorreu um error no servidor");
			return;
		}
		setRefresh(!refresh);
	}

	useEffect(() => {
		fetchItems();
	}, [saveDate, refresh]);

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

			<Calendar saveDate={saveDate} setSaveDate={setSaveDate} />

			<View>
				<View className="h-[322px]">
					{loading && <CardScheduleEmpty />}

					{!loading && orders.length > 0 && (
						<FlatList
							className="gap-2 flex-1 h-[322px]"
							keyExtractor={(item) => item.id}
							data={orders}
							renderItem={({ item }) => (
								<CardSchedule
									order={item}
									orderItems={item.order_items}
									onRemove={() => handleCancelOrder(item)}
								/>
							)}
							contentContainerStyle={{ paddingBottom: 100 }}
							showsVerticalScrollIndicator={false}
							style={{ flex: 1 }}
						/>
					)}
					{!loading && orders.length === 0 && (
						<View className="gap-2 h-[322px] pb-[100px] items-center justify-center">
							<Text className="text-gray-400 text-sm">
								Não existe nenhum pedido feitos
							</Text>
						</View>
					)}
				</View>
			</View>
		</Container>
	);
}
