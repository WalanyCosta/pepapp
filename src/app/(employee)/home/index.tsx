import { Container } from "@/components/layout";
import { router } from "expo-router";
import { View, Text, Image, Alert } from "react-native";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { useEffect, useState } from "react";
import { Tab, TabScreen } from "@/components/layout/tab";
import { supabase } from "@/lib/supabase";
import type { Item } from "@/models/item";
import { Items } from "@/components/screen/items";
import type { Category } from "@/models/category";
import { Categories } from "@/components/screen/categories";

const categoryDefault = {
	id: "any_id",
	icon: "all",
	name: "Todos",
	description: "any_description",
} as Category;

export default function Home() {
	const [categories, setCategories] = useState<Category[]>([categoryDefault]);

	const [items, setItems] = useState<Item[]>([]);
	const [isLoadingItem, setIsLoadingItem] = useState(false);
	const [isLoadingCategory, setIsLoadingCategory] = useState(false);
	const [isActive, setIsActive] = useState("Todos");
	const [isActiveTab, setIsActiveTab] = useState("House");

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
					<Text className="font-heading text-2xl">Olá Marcos 👋</Text>
					<View className="rounded-md size-10 items-center justify-center">
						<Avatar className="rounded-md w-10 h-10 border border-input">
							<AvatarFallback className="w-full h-full rounded-md text-xs">
								MA
							</AvatarFallback>
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
					icon="ListPlus"
					active={isActiveTab}
					setActive={setIsActiveTab}
					onPress={() => {
						router.replace("/(employee)/order");
					}}
				/>
				<TabScreen
					icon="CalendarCheck"
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
