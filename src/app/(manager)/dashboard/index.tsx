import { Container } from "@/components/layout";
import { Header } from "@/components/layout/header";
import { Icon } from "@/components/layout/icon-component";
import {
	IconOptionDelete,
	OptionDelete,
	OptionRoot,
} from "@/components/layout/options/Option";
import { Tab, TabScreen } from "@/components/layout/tab";
import { CardOrder } from "@/components/screen/card-order";
import { CardScheduleEmpty } from "@/components/screen/schedules/card-schedule-empty";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { useImage } from "@/hooks/use-image";
import { supabase } from "@/lib/supabase";
import { type Order, OrderStatus } from "@/models/order";
import { formatItems } from "@/utils/fomat-Items";
import { formatTime } from "@/utils/format-time";
import { router } from "expo-router";
import { BagSimple, Clock, QrCode, UsersThree } from "phosphor-react-native";
import { useEffect, useMemo, useState } from "react";
import { FlatList, ScrollView } from "react-native";
import { Alert } from "react-native";
import { View, Text } from "react-native";

export default function Dasboard() {
	const { user, setAuth } = useAuth();
	const [refresh, setRefresh] = useState(false);
	const [loading, setLoading] = useState(false);
	const [orders, setOrders] = useState<Order[]>([]);
	const { url, setUrl } = useImage("files");
	const [totalOrder, setTotalOrder] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const [totalUsers, setTotalUsers] = useState(0);
	const [isActiveTab, setIsActiveTab] = useState("Gauge");

	async function signOut() {
		await supabase.auth.signOut();
		setAuth(null);
	}

	const fetchItems = async () => {
		let response: any;
		setLoading(true);

		response = await supabase
			.from("orders")
			.select("*, users!inner(*), order_items!inner(*, items!inner(*))")
			.eq("status", OrderStatus.PENDING);

		if (response.error) {
			setLoading(false);
			Alert.alert("Error do sistema", response.error.message);
			return;
		}

		setOrders(response.data);
		setLoading(false);
	};

	async function getWeeklyOrders() {
		const today = new Date();
		const firstDayOfWeek = new Date(
			today.setDate(today.getDate() - today.getDay()),
		); // Domingo

		const { error, count } = await supabase
			.from("orders")
			.select("*", { count: "exact", head: true }) // Contagem exata
			.neq("status", OrderStatus.CANCEL)
			.gte("created_at", firstDayOfWeek.toISOString())
			.lt("created_at", new Date().toISOString()); // Até o momento atual

		if (error) {
			console.error("Error fetching weekly orders:", error.message);
			return;
		}
		setTotalOrder(count ?? 0);
	}

	async function getTotalItem() {
		const { error, count } = await supabase
			.from("items")
			.select("*", { count: "exact", head: true }); // Contagem exata

		if (error) {
			console.error("Error fetching weekly orders:", error.message);
			return;
		}
		setTotalItems(count ?? 0);
	}

	async function getTotalUsers() {
		const { error, count } = await supabase
			.from("users")
			.select("*", { count: "exact", head: true }); // Contagem exata

		if (error) {
			console.error("Error fetching weekly orders:", error.message);
			return;
		}
		setTotalUsers(count ?? 0);
	}

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

	useEffect(() => {
		getWeeklyOrders();
		getTotalItem();
		getTotalUsers();
	}, [loading]);

	useEffect(() => {
		fetchItems();
	}, [refresh]);

	return (
		<Container>
			<Header url={url} />

			<ScrollView
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				className="mb-5"
				contentContainerClassName="gap-3 items-center pr-8"
			>
				<View className="w-64 bg-white border border-input gap-3 px-3 py-4 rounded-md shadow-md items-start">
					<View className="bg-violet-500 px-1 py-1 rounded-md">
						<BagSimple size={18} weight="regular" color="#fff" />
					</View>

					<View className="gap-1">
						<Text className="text-sm text-gray-600 uppercase">
							Pedidos Feitos
						</Text>
						<Text className="text-2xl">{totalOrder}</Text>
					</View>

					<View className="bg-violet-300 py-2 pl-3 w-full rounded-md flex-row gap-2 items-center">
						<Icon
							color={totalOrder >= 10 ? "#0d9488" : "#dc2626"}
							size={18}
							name={totalOrder >= 10 ? "TrendUp" : "TrendDown"}
						/>
						<Text className="text-xs"> Nesta semana</Text>
					</View>
				</View>

				<View className="w-64 bg-white border border-input gap-3 px-3 py-4 rounded-md shadow-md items-start">
					<View className="bg-violet-500 px-1 py-1 rounded-md">
						<QrCode size={18} weight="regular" color="#fff" />
					</View>

					<View className="gap-1">
						<Text className="text-sm text-gray-600 uppercase">
							Itens Cadastros
						</Text>
						<Text className="text-2xl">{totalItems}</Text>
					</View>

					<View className="bg-violet-300 py-2 pl-3 w-full rounded-md flex-row gap-2 items-center">
						<Icon color="#0d9488" size={18} name="TrendUp" />
						<Text className="text-xs">Registrados no sistema</Text>
					</View>
				</View>

				<View className="w-64 bg-white border border-input gap-3 px-3 py-4 rounded-md shadow-md items-start">
					<View className="bg-violet-500 px-1 py-1 rounded-md">
						<UsersThree size={18} weight="regular" color="#fff" />
					</View>
					<View className="gap-1">
						<Text className="text-sm text-gray-600 uppercase">
							Usuários Cadastros
						</Text>
						<Text className="text-2xl">{totalUsers}</Text>
					</View>

					<View className="bg-violet-300 py-2 pl-3 w-full rounded-md flex-row gap-2 items-center">
						<Icon color="#0d9488" size={18} name="TrendUp" />
						<Text className="text-xs">Registrados no sistema</Text>
					</View>
				</View>
			</ScrollView>

			<View>
				<Text className="text-gray-400 text-sm ml-3 mb-4">
					Pedidos recentes
				</Text>

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
			</View>

			<Tab>
				<TabScreen
					icon="QrCode"
					active={isActiveTab}
					setActive={setIsActiveTab}
					onPress={() => {
						router.replace("/(manager)/items");
					}}
				/>
				<TabScreen
					icon="UsersThree"
					active={isActiveTab}
					setActive={setIsActiveTab}
					onPress={() => {
						router.replace("/(manager)/users");
					}}
				/>

				<TabScreen
					icon="Gauge"
					active={isActiveTab}
					setActive={setIsActiveTab}
					onPress={() => {}}
				/>
				<TabScreen
					icon="ClockCounterClockwise"
					active={isActiveTab}
					setActive={setIsActiveTab}
					onPress={() => {
						router.replace("/(manager)/history");
					}}
				/>

				<TabScreen
					icon="GearSix"
					active={isActiveTab}
					setActive={setIsActiveTab}
					onPress={() => {}}
				/>
			</Tab>
		</Container>
	);
}
