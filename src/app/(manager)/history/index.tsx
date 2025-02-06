import { Container } from "@/components/layout";
import { HeaderBack } from "@/components/layout/header-back";
import { PopoversSuccess } from "@/components/layout/popovers/popovers-success";
import { CardOrder } from "@/components/screen/card-order";
import { CardScheduleEmpty } from "@/components/screen/schedules/card-schedule-empty";
import { Checkbox } from "@/components/ui/Checkbox";
import { Search } from "@/components/ui/search";
import { useError } from "@/hooks/use-error";
import { supabase } from "@/lib/supabase";
import { type Order, OrderStatus } from "@/models/order";

import { useDeferredValue, useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";

export default function History() {
	const [query, setQuery] = useState("");
	const [orders, setOrders] = useState<Order[]>([]);
	const [filterStatus, setFilterStatus] = useState<string>(OrderStatus.PENDING);
	const [fetchOrders, setFetchOrders] = useState(false);
	const deferredQuery = useDeferredValue(query);
	const {
		visible: visibleError,
		setVisible: setVisibleError,
		error,
		setError,
	} = useError();
	const [visible, setVisible] = useState(false);

	async function handleUpdateOrdersStatus(
		orderId: number | string,
		orderStatus: OrderStatus,
	) {
		const orderExists = orders.find((order) => order.id === orderId);

		if (!orderExists) {
			return;
		}

		if (
			orderExists.status === OrderStatus.CANCEL ||
			orderExists.status === orderStatus
		) {
			return;
		}

		const { error } = await supabase
			.from("orders")
			.update({ status: orderStatus })
			.eq("id", orderExists.id);

		if (error) {
			setVisibleError(true);
			setError(null);
			return;
		}

		const filterOrders = orders.filter((order) => order.id !== orderId);

		setOrders(filterOrders);
		Alert.alert("Sucesso", "Feito com sucesso");
	}

	const getOrders = async () => {
		setFetchOrders(true);
		let response: any;

		if (deferredQuery.trim() !== "") {
			response = await supabase
				.from("orders")
				.select("*, users!inner(*), order_items!inner(*, items!inner(*))")
				.eq("status", filterStatus)
				.ilike("users.name", `%${deferredQuery}%`);
		} else {
			response = await supabase
				.from("orders")
				.select("*, users!inner(*), order_items!inner(*, items!inner(*))")
				.eq("status", filterStatus)
				.order("created_at", { ascending: false });
		}

		if (response.error) {
			setFetchOrders(false);
			setVisibleError(true);
			setError(null);
			return;
		}

		setFetchOrders(false);
		setOrders(response.data);
	};

	useEffect(() => {
		getOrders();
	}, [deferredQuery, filterStatus]);

	return (
		<Container
			visible={visibleError}
			setVisible={setVisibleError}
			error={error}
		>
			<HeaderBack
				title="Históricos de pedidos"
				backRoute="/(manager)/dashboard"
			/>

			<Search setQuery={setQuery} query={query}>
				<Checkbox
					name={OrderStatus.PENDING}
					setFilter={setFilterStatus}
					filter={filterStatus}
					label={OrderStatus.PENDING}
				/>
				<Checkbox
					name={OrderStatus.ACCEPTED}
					setFilter={setFilterStatus}
					filter={filterStatus}
					label={OrderStatus.ACCEPTED}
				/>
				<Checkbox
					name={OrderStatus.DENIED}
					setFilter={setFilterStatus}
					filter={filterStatus}
					label={OrderStatus.DENIED}
				/>
			</Search>

			{fetchOrders && <CardScheduleEmpty length={7} />}

			{!fetchOrders && orders.length > 0 && (
				<FlatList
					className="gap-2 h-[75vh]"
					keyExtractor={(item) => item.id.toString()}
					data={orders}
					renderItem={({ item }) => (
						<CardOrder
							item={item}
							handleUpdateOrdersStatus={handleUpdateOrdersStatus}
						/>
					)}
					contentContainerClassName="pb-40"
					showsVerticalScrollIndicator={false}
				/>
			)}

			{!fetchOrders && orders.length === 0 && (
				<View className="gap-2 h-[322px] pb-[100px] items-center justify-center">
					<Text className="text-gray-400 text-sm">
						Não existe nenhum pedido feitos
					</Text>
				</View>
			)}

			<PopoversSuccess visible={visible} setVisible={setVisible} />
		</Container>
	);
}
