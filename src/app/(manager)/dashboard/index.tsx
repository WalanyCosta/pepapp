import { Container } from "@/components/layout";
import { Header } from "@/components/layout/header";
import { Icon } from "@/components/layout/icon-component";
import {
	IconOptionDelete,
	OptionDelete,
	OptionRoot,
} from "@/components/layout/options/Option";
import { PopoversSuccess } from "@/components/layout/popovers/popovers-success";
import { Tab, TabScreen, TabScreenRoute } from "@/components/layout/tab";
import { CardOrder } from "@/components/screen/card-order";
import { StatisticCards } from "@/components/screen/dashboard/statistic-cards";
import { CardScheduleEmpty } from "@/components/screen/schedules/card-schedule-empty";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/auth-context";
import { useImage } from "@/hooks/use-image";
import { supabase } from "@/lib/supabase";
import { type Order, OrderStatus } from "@/models/order";
import { UserStatus } from "@/models/user";
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
	const [loadingOrder, setLoadingOrder] = useState(false);
	const [loadingItems, setLoadingItems] = useState(false);
	const [loadingUsers, setLoadingUsers] = useState(false);
	const [orders, setOrders] = useState<Order[]>([]);
	const [visible, setVisible] = useState(false);
	const [visibleError, setVisibleError] = useState(false);
	const { url, setUrl } = useImage("files");
	const [totalOrder, setTotalOrder] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const [totalUsers, setTotalUsers] = useState(0);
	const [isActiveTab, setIsActiveTab] = useState("Gauge");

	const fetchItems = async () => {
		let response: any;
		setLoading(true);

		response = await supabase
			.from("orders")
			.select("*, users!inner(*), order_items!inner(*, items!inner(*))")
			.eq("status", OrderStatus.PENDING)
			.order("created_at", { ascending: false });

		if (response.error) {
			setLoading(false);
			Alert.alert("Error do sistema", response.error.message);
			return;
		}

		setOrders(response.data);
		setLoading(false);
	};

	async function getWeeklyOrders() {
		setLoadingOrder(false);
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
			setLoadingOrder(true);
			setVisibleError(true);
			return;
		}
		setTotalOrder(count ?? 0);
		setLoadingOrder(true);
	}

	async function getTotalItem() {
		setLoadingItems(false);
		const { error, count } = await supabase
			.from("items")
			.select("*", { count: "exact", head: true }); // Contagem exata

		if (error) {
			setVisibleError(true);
			setLoadingItems(true);
			return;
		}
		setTotalItems(count ?? 0);
		setLoadingItems(true);
	}

	async function getTotalUsers() {
		setLoadingUsers(false);
		const { error, count } = await supabase
			.from("users")
			.select("*", { count: "exact", head: true })
			.neq("status", UserStatus.DESACTIVED); // Contagem exata

		if (error) {
			setVisibleError(true);
			setLoadingUsers(true);
			return;
		}
		setTotalUsers(count ?? 0);
		setLoadingUsers(true);
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
			setVisibleError(true);
			return;
		}

		const filterOrders = orders.filter((order) => order.id !== orderId);
		setOrders(filterOrders);
	}

	useEffect(() => {
		getWeeklyOrders();
		getTotalItem();
		getTotalUsers();
	}, [refresh]);

	useEffect(() => {
		fetchItems();
	}, [refresh]);

	return (
		<Container visible={visibleError} setVisible={setVisibleError}>
			<Header url={url} />

			<ScrollView
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				className="mb-5 -mt-3"
				contentContainerClassName="gap-3 items-center pr-8"
			>
				{!loadingOrder &&
					!loadingItems &&
					!loadingUsers &&
					Array.from({ length: 3 }).map((_, index) => (
						<Skeleton key={index.toString()} className="w-64 h-44" />
					))}

				{loadingOrder && loadingItems && loadingUsers && (
					<StatisticCards
						totalItems={totalItems}
						totalUsers={totalUsers}
						totalOrder={totalOrder}
					/>
				)}
			</ScrollView>

			<View className="h-[50vh]">
				<Text className="text-gray-400 text-base ml-3 mb-4">
					Pedidos recentes
				</Text>

				{loading && <CardScheduleEmpty />}

				{!loading && orders.length > 0 && (
					<FlatList
						className="gap-3 h-[322px]"
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

				{!loading && orders.length === 0 && (
					<View className="gap-2 flex-1 pb-[100px] items-center justify-center">
						<Text className="text-gray-400 text-sm">
							Não existe nenhum pedido feitos
						</Text>
					</View>
				)}
			</View>

			<Tab className="">
				<TabScreen
					icon="QrCode"
					active={isActiveTab}
					setActive={setIsActiveTab}
					routeRef="/(manager)/items"
				/>
				<TabScreen
					icon="UsersThree"
					active={isActiveTab}
					setActive={setIsActiveTab}
					routeRef="/(manager)/users"
				/>

				<TabScreenRoute
					icon="Gauge"
					active={isActiveTab}
					setActive={setIsActiveTab}
					onPress={() => {}}
				/>
				<TabScreen
					routeRef="/(manager)/history"
					icon="ClockCounterClockwise"
					active={isActiveTab}
					setActive={setIsActiveTab}
				/>

				<TabScreen
					routeRef="/(employee)/settings"
					icon="GearSix"
					active={isActiveTab}
					setActive={setIsActiveTab}
				/>
			</Tab>

			<PopoversSuccess
				message="Decisão tomada com sucesso"
				visible={visible}
				setVisible={setVisible}
			/>
		</Container>
	);
}
