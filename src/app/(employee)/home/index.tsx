import { Container } from "@/components/layout";
import { router } from "expo-router";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Tab, TabScreen, TabScreenRoute } from "@/components/layout/tab";
import { supabase } from "@/lib/supabase";
import type { Item } from "@/models/item";
import { Items } from "@/components/screen/items";
import type { Category } from "@/models/category";
import { Categories } from "@/components/screen/categories";
import { useItem } from "@/context/item-context";
import { Header } from "@/components/layout/header";
import { useError } from "@/hooks/use-error";
import type { Href } from "expo-router";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { View } from "react-native";
import { Text } from "react-native";
import { WifiX } from "phosphor-react-native";
import { Button } from "@/components/ui";
import { NetworkingError } from "@/components/layout/networking-error";

const categoryDefault = {
	id: "any_id",
	icon: "ArrowsInCardinal",
	name: "Todos",
	description: "any_description",
} as Category;

export default function Home() {
	const { visible, setVisible, error, setError } = useError();
	const [categories, setCategories] = useState<Category[]>([]);
	const [items, setItems] = useState<Item[]>([]);
	const [isLoadingItem, setIsLoadingItem] = useState(false);
	const [isLoadingCategory, setIsLoadingCategory] = useState(false);
	const [isActive, setIsActive] = useState("ArrowsInCardinal");
	const [isActiveTab, setIsActiveTab] = useState("House");
	const { getItemSize, order } = useItem();
	const isOnline = useOnlineStatus();
	const [reload, setReload] = useState(false);

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

	const BlockChangeScreenIfOrderExists = useCallback(
		(route: Href) => {
			// if (order) {
			// 	setVisible(true);
			// 	setError({
			// 		code: "INFO",
			// 		title: "Termine a edição do pedido. Para poder navegar",
			// 	});
			// 	return "/(employee)/home";
			// }
			return route;
		},
		[order],
	);

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

		if (!isOnline) {
			setError({
				code: "INFO",
				title: "Ligue a sua internet",
			});
			setVisible(true);
			setIsLoadingItem(false);
			return;
		}

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
	}, [reload]);

	useEffect(() => {
		fetchItems();
	}, [isActive, reload]);

	return (
		<Container visible={visible} setVisible={setVisible} error={error}>
			<Header />

			{!isLoadingItem && !isOnline && items.length === 0 ? (
				<NetworkingError setReload={setReload} reload={reload} />
			) : (
				<Fragment>
					<Categories
						isLoadingCategory={isLoadingCategory}
						categories={categories}
						isActive={isActive}
						setIsActive={setIsActive}
					/>

					<Items items={items} isLoadingItem={isLoadingItem} />
				</Fragment>
			)}

			<Tab className="bottom-28">
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
					routeRef={BlockChangeScreenIfOrderExists("/(employee)/schedule")}
				/>
				<TabScreen
					routeRef={BlockChangeScreenIfOrderExists("/(employee)/settings")}
					icon="GearSix"
					active={isActiveTab}
					setActive={setIsActiveTab}
				/>
			</Tab>
		</Container>
	);
}
