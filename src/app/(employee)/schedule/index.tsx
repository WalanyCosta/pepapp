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
import dayjs from "dayjs";
import { useError } from "@/hooks/use-error";
import { useItem } from "@/context/item-context";
import { router } from "expo-router";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { NetworkingError } from "@/components/layout/networking-error";

export default function Schedule() {
	const { user } = useAuth();
	const [refresh, setRefresh] = useState(false);
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(false);
	const { setOrder, setItems, order, items } = useItem();
	const isOnline = useOnlineStatus();
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

		if (!isOnline) {
			setError({
				code: "INFO",
				title: "Ligue a sua internet",
			});
			setVisibleError(true);
			setLoading(false);
			return;
		}

		if (saveDate === null) {
			response = await supabase
				.from("orders")
				.select("*, order_items!inner(*, items(*))")
				.eq("userId", user?.id)
				.order("created_at", { ascending: false });
		} else {
			response = await supabase
				.from("orders")
				.select("*, order_items!inner(*, items!inner(*))")
				.eq("userId", user?.id)
				.eq("date", dayjs(saveDate).format("YYYY-MM-DD"))
				.order("created_at", { ascending: false });
		}

		if (response.error) {
			setLoading(false);
			setVisibleError(true);
			setError(null);
			return;
		}

		setLoading(false);
		setOrders(response.data);
	};

	async function handleCancelOrder(orderSelected: Order) {
		if (order) {
			setError({ code: "INFO", title: "Finaliza o processo de editar" });
			setVisibleError(true);
			return;
		}

		if (items.length > 0) {
			setError({ code: "INFO", title: "Finaliza o teu primeiro pedido" });
			setVisibleError(true);
			return;
		}

		if (orderSelected.status === OrderStatus.CANCEL) {
			return;
		}

		if (
			orderSelected.status === OrderStatus.DENIED ||
			orderSelected.status === OrderStatus.ACCEPTED
		) {
			setError({ code: "INFO", title: "Esse já tem uma resposta!" });
			setVisibleError(true);
			return;
		}

		const { error } = await supabase
			.from("orders")
			.update({ status: OrderStatus.CANCEL })
			.eq("id", orderSelected.id);

		if (error) {
			setError(null);
			setVisibleError(true);
			return;
		}
		setRefresh(!refresh);
	}

	async function handleEdit(id: string) {
		if (order) {
			setVisibleError(true);
			setError({ code: "INFO", title: "Finaliza o processo de editar" });
			return;
		}

		if (items.length > 0) {
			setVisibleError(true);
			setError({ code: "INFO", title: "Finaliza o teu primeiro pedido" });
			return;
		}

		const { data, error } = await supabase
			.from("orders")
			.select("*, order_items!inner(*, items(*))")
			.eq("id", id)
			.single();

		if (error) {
			setVisibleError(true);
			setError(null);
			return;
		}
		if (data) {
			const order = data ? (data as Order) : null;
			const items =
				order?.order_items.map((order_item) => order_item.items) ?? [];
			setOrder(order);
			setItems(items);
			router.replace("/(employee)/order");
		}
	}

	useEffect(() => {
		fetchItems();
	}, [saveDate, refresh]);

	return (
		<Container
			visible={visibleError}
			setVisible={setVisibleError}
			error={error}
		>
			<HeaderBack title="Pedidos feitos" backRoute="/(employee)/home" />

			<Calendar saveDate={saveDate} setSaveDate={setSaveDate} />

			<View>
				<View className="h-[70vh]">
					{loading && <CardScheduleEmpty length={5} />}

					{!loading && orders.length > 0 && (
						<FlatList
							className="gap-2 flex-1"
							keyExtractor={(item) => item.id}
							data={orders}
							renderItem={({ item }) => (
								<CardSchedule
									order={item}
									orderItems={item.order_items}
									onAction={() => handleCancelOrder(item)}
									onEdit={() => handleEdit(item.id)}
								/>
							)}
							contentContainerStyle={{ paddingBottom: 24 }}
							showsVerticalScrollIndicator={false}
						/>
					)}
					{!loading && orders.length === 0 && (
						<View className="gap-2 h-[322px] pb-[100px] items-center justify-center">
							<Text className="text-gray-400 text-sm">
								Não existe nenhum pedido feitos
							</Text>
						</View>
					)}
					{!loading && !isOnline && orders.length === 0 && (
						<NetworkingError setReload={setRefresh} reload={refresh} />
					)}
				</View>
			</View>
		</Container>
	);
}
