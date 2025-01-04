import { Container } from "@/components/layout";
import { router } from "expo-router";
import { View, Text, Image, FlatList, Alert } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { CardItem } from "@/components/layout/card-item";
import {
	CategoryItem,
	type IconProps,
} from "@/components/layout/category-item";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Tab, TabScreen } from "@/components/layout/tab";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/Skeleton";
import { CardItemEmpty } from "@/components/layout/card-item-empty";

type CategoryProps = {
	id: string;
	icon: string;
	name: string;
	description?: string;
	createdAt: Date;
};

type ItemProps = {
	id: string;
	name: string;
	image: string;
	description: string;
	categoryId: string;
	createdAt: Date;
};

const categoryDefault: CategoryProps = {
	id: "any_id",
	icon: "all",
	name: "Todos",
	description: "any_description",
};

export default function Home() {
	const [categories, setCategories] = useState<CategoryProps[]>([
		categoryDefault,
	]);

	const [items, setItems] = useState<ItemProps[]>([]);
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

	const getAllItems = async () => {
		const { data, error } = await supabase.from("items").select("*");
		if (error) {
			Alert.alert("Error do sistema", error.message);
			return [];
		}

		return data === null ? [] : (data as ItemProps[]);
	};

	const getItemsByCategory = async () => {
		const { data, error } = await supabase
			.from("items")
			.select("*, categories!inner(name)")
			.eq("categories.name", isActive);
		if (error) {
			setIsLoadingItem(false);
			Alert.alert("Error do sistema", error.message);
			return [];
		}

		return data === null ? [] : (data as ItemProps[]);
	};

	useEffect(() => {
		fetchCategory();
	}, []);

	useEffect(() => {
		setIsLoadingItem(true);

		if (isActive === "Todos") {
			getAllItems().then((data) => {
				setItems(data);
				setIsLoadingItem(false);
			});
		} else {
			getItemsByCategory().then((data) => {
				setItems(data);
				setIsLoadingItem(false);
			});
		}
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
			{isLoadingCategory ? (
				<View className="gap-2 mb-8 flex-row">
					<Skeleton className="w-24 h-10 rounded-md" />
					<Skeleton className="w-24 h-10 rounded-md" />
					<Skeleton className="w-24 h-10 rounded-md" />
					<Skeleton className="w-24 h-10 rounded-md" />
				</View>
			) : (
				<FlatList
					className="mb-8"
					data={categories}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<CategoryItem
							name={item.name}
							icon={item.icon as IconProps}
							isActive={isActive}
							setIsActive={setIsActive}
						/>
					)}
					showsHorizontalScrollIndicator={false}
					horizontal={true}
				/>
			)}

			{isLoadingItem && <CardItemEmpty />}

			{!isLoadingItem && items.length > 0 && (
				<FlatList
					className="gap-2 h-[322px]"
					keyExtractor={(item) => item.id}
					data={items}
					renderItem={({ item }) => (
						<CardItem
							source={require("@/assets/fotos-uniformes.jpg")}
							title={item.name}
							description={item.description}
						/>
					)}
					contentContainerStyle={{ paddingBottom: 100 }}
					showsVerticalScrollIndicator={false}
					style={{ flex: 1 }}
				/>
			)}
			{!isLoadingItem && items.length === 0 && (
				<View className="gap-2 h-[322px] pb-[100px] items-center justify-center">
					<Text className="text-gray-400 text-sm">
						Não existe items cadastrados
					</Text>
				</View>
			)}
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
