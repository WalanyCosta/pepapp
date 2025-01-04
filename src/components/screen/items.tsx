import { Fragment } from "react";
import type { Item } from "@/models/item";
import { CardItemEmpty } from "../layout/card-item-empty";
import { CardItem } from "../layout/card-item";
import { FlatList } from "react-native-gesture-handler";
import { View, Text } from "react-native";

type Props = {
	items: Item[];
	isLoadingItem: boolean;
};

export function Items({ items, isLoadingItem }: Props) {
	return (
		<Fragment>
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
		</Fragment>
	);
}
