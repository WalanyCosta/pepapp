import { Container } from "@/components/layout";
import { router } from "expo-router";
import { Alert } from "react-native";
import { useEffect, useState } from "react";
import { Tab, TabScreen, TabScreenRoute } from "@/components/layout/tab";
import { supabase } from "@/lib/supabase";
import type { Item } from "@/models/item";
import { Items } from "@/components/screen/items";
import type { Category } from "@/models/category";
import { Categories } from "@/components/screen/categories";
import { useItem } from "@/context/item-context";
import { Header } from "@/components/layout/header";
import {
	PopoversError,
	type StatusCode,
} from "@/components/layout/popovers/popovers-error";

const categoryDefault = {
	id: "any_id",
	icon: "ArrowsInCardinal",
	name: "Todos",
	description: "any_description",
} as Category;

export default function Home() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [items, setItems] = useState<Item[]>([]);
	const [visible, setVisible] = useState(false);
	const [error, setError] = useState<{
		code: StatusCode;
		title: string;
	} | null>(null);
	const [isLoadingItem, setIsLoadingItem] = useState(false);
	const [isLoadingCategory, setIsLoadingCategory] = useState(false);
	const [isActive, setIsActive] = useState("ArrowsInCardinal");
	const [isActiveTab, setIsActiveTab] = useState("House");
	const { getItemSize } = useItem();

	function handleChangeScreenToOrder() {
		if (getItemSize() <= 0) {
			setError({
				code: "INFO",
				title: "Selecione um item para poder fazer pedido",
			});
			setVisible(true);
			setIsActiveTab("House");
			return;
		}
		router.replace("/(employee)/order");
	}

	const fetchCategory = async () => {
		setIsLoadingCategory(true);

		const { data, error } = await supabase.from("categories").select("*");

		if (error) {
			setVisible(true);
			setError(null);
			setIsLoadingCategory(false);
			return;
		}

		setCategories([categoryDefault, ...data]);
		setIsLoadingCategory(false);
	};

	const fetchItems = async () => {
		let response: any;
		setIsLoadingItem(true);

		if (isActive === "ArrowsInCardinal") {
			response = await supabase.from("items").select("*");
		} else {
			response = await supabase
				.from("items")
				.select("*, categories!inner(name)")
				.eq("categories.icon", isActive);
		}

		if (response.error) {
			setIsLoadingItem(false);
			setVisible(true);
			setError(null);
			return;
		}

		setItems(response.data);
		setIsLoadingItem(false);
	};

	useEffect(() => {
		fetchCategory();
	}, []);

	useEffect(() => {
		fetchItems();
	}, [isActive]);

	return (
		<Container>
			<Header />

			<Categories
				isLoadingCategory={isLoadingCategory}
				categories={categories}
				isActive={isActive}
				setIsActive={setIsActive}
			/>

			<Items items={items} isLoadingItem={isLoadingItem} />

			<Tab>
				<TabScreenRoute
					icon="House"
					active={isActiveTab}
					setActive={setIsActiveTab}
					onPress={() => {}}
				/>
				<TabScreenRoute
					icon="BagSimple"
					active={isActiveTab}
					badge={true}
					badgeNumber={getItemSize()}
					setActive={setIsActiveTab}
					onPress={handleChangeScreenToOrder}
				/>
				<TabScreen
					icon="Archive"
					active={isActiveTab}
					setActive={setIsActiveTab}
					routeRef="/(employee)/schedule"
				/>
				<TabScreen
					routeRef="/(employee)/settings"
					icon="GearSix"
					active={isActiveTab}
					setActive={setIsActiveTab}
				/>
			</Tab>

			<PopoversError
				visible={visible}
				setVisible={setVisible}
				title={error?.title}
				statusCode={error?.code}
			/>
		</Container>
	);
}
