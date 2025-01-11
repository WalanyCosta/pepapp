import { Container } from "@/components/layout";
import { router } from "expo-router";
import { View, Text, Image, Alert } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
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
	}, [isActive, isLoadingCategory]);

	return (
		<Container>
			<Image
				className="mt-6 mb-10"
				source={require("@/assets/mini-logo.png")}
			/>
			<View className="gap-1 mb-12 justify-center">
				<View className="flex-row justify-between items-center">
					<Text className="font-heading text-2xl">
						Olá {user?.name.split(" ")[0]} 👋
					</Text>
					<View className="rounded-md size-10 items-center justify-center relative">
						<Avatar className="absolute -top-3">
							{url ? (
								<AvatarImage
									source={{
										uri: url,
									}}
								/>
							) : (
								<AvatarFallback>pq</AvatarFallback>
							)}
						</Avatar>
					</View>
				</View>
				<Text className="text-sm text-gray-500">
					Lorem ipsum is simply dummy text of te printing
				</Text>
			</View>

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
