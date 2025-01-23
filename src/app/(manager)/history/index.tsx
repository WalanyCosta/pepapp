import { Container } from "@/components/layout";
import { HeaderBack } from "@/components/layout/header-back";
import { CardOrder } from "@/components/screen/card-order";
import { CardScheduleEmpty } from "@/components/screen/schedules/card-schedule-empty";
import { Checkbox } from "@/components/ui/Checkbox";
import {
	DropDown,
	DropDownContent,
	DropDownTrigger,
} from "@/components/ui/DropDown";
import { supabase } from "@/lib/supabase";
import { type Order, OrderStatus } from "@/models/order";
import { Faders, MagnifyingGlass } from "phosphor-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export default function History() {
	const searchRef = useRef<TextInput>(null);
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [orders, setOrders] = useState<Order[]>([]);
	const [filterStatus, setFilterStatus] = useState("");
	const [fetchOrders, setFetchOrders] = useState(false);
	const [timeoutId, setTimeoutId] = useState();

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
			Alert.alert("Error", "Ocorreu um error no servidor");
			return;
		}

		const filterOrders = orders.filter((order) => order.id !== orderId);

		setOrders(filterOrders);
		Alert.alert("Sucesso", "Feito com sucesso");
	}

	const getOrders = async (query = "", filterStatus = "") => {
		setFetchOrders(true);
		let response: any;

		if (query.trim() !== "" || filterStatus.trim() !== "") {
			response = await supabase
				.from("orders")
				.select("*, users!inner(*), order_items!inner(*, items!inner(*))")
				.or(
					`${query && `users.name.ilike.%${query}%`} status.eq.${filterStatus}`,
				);
		} else {
			response = await supabase
				.from("orders")
				.select("*, users!inner(*), order_items!inner(*, items!inner(*))");
		}

		if (response.error) {
			setFetchOrders(false);
			Alert.alert("Error do sistema", response.error.message);
			return;
		}

		setOrders(response.data);
		setFetchOrders(false);
	};

	useEffect(() => {
		let newTimeoutId: any;

		if (timeoutId) {
			clearTimeout(timeoutId); // Limpa qualquer timeout pendente
		}

		if (query.trim() !== "" || filterStatus.trim() !== "") {
			newTimeoutId = setTimeout(() => {
				getOrders(query, filterStatus);
			}, 500);
		} else {
			getOrders();
		}

		return () => {
			if (newTimeoutId) {
				setTimeoutId(newTimeoutId);
			}
		};
	}, [query, filterStatus]);

	return (
		<Container>
			<HeaderBack title="Históricos de pedidos" />

			<View className="px-3 mb-5 border relative border-input rounded-md bg-white w-full flex-row items-center gap-3">
				<TouchableOpacity
					onPress={() => {
						searchRef.current?.focus();
					}}
				>
					<MagnifyingGlass color="#9ca3af" size={16} />
				</TouchableOpacity>
				<TextInput
					ref={searchRef}
					className="text-sm flex-1 text-nowrap text-gray-400"
					placeholder="Pesquisar"
					onChangeText={setQuery}
				/>

				<DropDown>
					<DropDownTrigger>
						<TouchableOpacity>
							<Faders color="#9ca3af" size={16} />
						</TouchableOpacity>
					</DropDownTrigger>
					<DropDownContent className="w-40 border border-input absolute -left-32 top-7">
						<Checkbox
							name={OrderStatus.ACCEPTED}
							setFilter={setFilterStatus}
							filter={filterStatus}
							label={OrderStatus.ACCEPTED}
						/>
						<Checkbox
							name={OrderStatus.PENDING}
							setFilter={setFilterStatus}
							filter={filterStatus}
							label={OrderStatus.PENDING}
						/>
						<Checkbox
							name={OrderStatus.DENIED}
							setFilter={setFilterStatus}
							filter={filterStatus}
							label={OrderStatus.DENIED}
						/>
					</DropDownContent>
				</DropDown>
			</View>

			{loading && <CardScheduleEmpty />}

			{!loading && orders.length > 0 && (
				<FlatList
					className="gap-2 flex-1 h-[322px]"
					keyExtractor={(item) => item.id.toString()}
					data={orders}
					renderItem={({ item }) => (
						<CardOrder
							item={item}
							handleUpdateOrdersStatus={handleUpdateOrdersStatus}
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
		</Container>
	);
}
