import { View, Text } from "react-native";
import { Container } from "@/components/layout";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/layout/calendar";
import { CardSchedule } from "@/components/screen/schedules/card-schedule";
import { OrderStatus, type Order } from "@/models/order";
import { FlatList } from "react-native-gesture-handler";
import { CardScheduleEmpty } from "@/components/screen/schedules/card-schedule-empty";
import { HeaderBack } from "@/components/layout/header-back";
import { PopoversError } from "@/components/layout/popovers/popovers-error";
import dayjs from "dayjs";
import { useError } from "@/hooks/use-error";

export default function Schedule() {
	const { user } = useAuth();
	const [refresh, setRefresh] = useState(false);
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const {
		visible: visibleError,
		setVisible: setVisibleError,
		error,
		setError,
	} = useError();
	const [saveDate, setSaveDate] = useState<Date | null>(null);

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
				.eq("date", dayjs(saveDate).format("YYYY-MM-AA"));
		}

		if (response.error) {
			setVisible(true);
			setError(null);
			setLoading(false);
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
			setVisible(true);
			setError(null);
			return;
		}
		setRefresh(!refresh);
	}

	useEffect(() => {
		fetchItems();
	}, [saveDate, refresh]);

	return (
		<Container visible={visible} setVisible={setVisible} error={error}>
			<HeaderBack title="Pedidos feitos" backRoute="/(employee)/home" />

			<Calendar saveDate={saveDate} setSaveDate={setSaveDate} />

			<View>
				<View className="h-[70vh]">
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

			<PopoversError visible={visible} setVisible={setVisible} />
		</Container>
	);
}
