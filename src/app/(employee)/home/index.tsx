import { Container } from "@/components/layout";
import { router } from "expo-router";
import { Alert } from "react-native";
import { useEffect, useState } from "react";
import { Tab, TabScreen } from "@/components/layout/tab";
import { supabase } from "@/lib/supabase";
import type { Item } from "@/models/item";
import { Items } from "@/components/screen/items";
import type { Category } from "@/models/category";
import { Categories } from "@/components/screen/categories";
import { useItem } from "@/context/item-context";
import { useAuth } from "@/context/auth-context";
import { useImage } from "@/hooks/use-image";
import { Header } from "@/components/layout/header";

const categoryDefault = {
	id: "any_id",
	icon: "all",
	name: "Todos",
	description: "any_description",
} as Category;

export default function Home() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [items, setItems] = useState<Item[]>([]);

	const [isLoadingItem, setIsLoadingItem] = useState(false);
	const [isLoadingCategory, setIsLoadingCategory] = useState(false);
	const [isActive, setIsActive] = useState("Todos");
	const [isActiveTab, setIsActiveTab] = useState("House");
	const { getItemSize } = useItem();
	const { user } = useAuth();
	const { setUrl, url } = useImage("files");

	function handleChangeScreenToOrder() {
		if (getItemSize() <= 0) {
			Alert.alert("Info", "Selecione um item para poder fazer pedido");
			setIsActiveTab("House");
			return;
		}
		router.replace("/(employee)/order");
	}

	const fetchCategory = async () => {
		setIsLoadingCategory(true);

		const { data, error } = await supabase.from("categories").select("*");

		if (error) {
			Alert.alert("Error do sistema", error.message);
			setIsLoadingCategory(false);
			return;
		}

		setCategories([categoryDefault, ...data]);
		setIsLoadingCategory(false);
	};

	const fetchItems = async () => {
		let response: any;
		setIsLoadingItem(true);

		if (isActive === "Todos") {
			response = await supabase.from("items").select("*");
		} else {
			response = await supabase
				.from("items")
				.select("*, categories!inner(name)")
				.eq("categories.name", isActive);
		}

		if (response.error) {
			setIsLoadingItem(false);
			Alert.alert("Error do sistema", response.error.message);
			return;
		}

		setItems(response.data);
		setIsLoadingItem(false);
	};

	useEffect(() => {
		fetchCategory();
		setUrl(user?.image || null);
	}, []);

	useEffect(() => {
		fetchItems();
	}, [isActive]);

	return (
		<Container>
			<Header url={url} />

			<Categories
				isLoadingCategory={isLoadingCategory}
				categories={categories}
				isActive={isActive}
				setIsActive={setIsActive}
			/>

			<Items items={items} isLoadingItem={isLoadingItem} />

			<Tab>
				<TabScreen
					icon="House"
					active={isActiveTab}
					setActive={setIsActiveTab}
					onPress={() => {}}
				/>
				<TabScreen
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
					onPress={() => {
						router.replace("/(employee)/schedule");
					}}
				/>
				<TabScreen
					icon="GearSix"
					active={isActiveTab}
					setActive={setIsActiveTab}
					onPress={() => {
						router.replace("/(employee)/settings");
					}}
				/>
			</Tab>
		</Container>
	);
}
