import { Container } from "@/components/layout";
import {
	IconOptionDelete,
	OptionDelete,
	OptionRoot,
} from "@/components/layout/options/Option";
import { router } from "expo-router";
import { ArrowLeft, Plus } from "phosphor-react-native";
import { Image, View, Text, TouchableOpacity, Alert } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FormItem } from "@/components/screen/item/form-item";
import type { Item } from "@/models/item";
import { supabase } from "@/lib/supabase";
import { CardItemEmpty } from "@/components/layout/card-item-empty";
import { FlatList } from "react-native";
import { verifyImageUri } from "@/utils/verify-image-uri";

export default function Items() {
	const [featchItems, setFeatchItems] = useState(false);
	const [items, setItems] = useState<Item[]>([]);

	const fetchItems = async () => {
		setFeatchItems(true);

		const { data, error } = await supabase.from("items").select("*");

		if (error) {
			setFeatchItems(false);
			Alert.alert("Error do sistema", error.message);
			return;
		}

		setItems(data);
		setFeatchItems(false);
	};
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	useEffect(() => {
		fetchItems();
	}, []);

	return (
		<View className="flex-1 relative">
			<Container>
				<TouchableOpacity
					onPress={() => {
						router.replace("/(manager)/dashboard");
					}}
					className="w-8 h-8 mt-3 mb-5 justify-center items-start"
				>
					<ArrowLeft color="#4B5563" size={24} />
				</TouchableOpacity>

				<View className="justify-center mb-8">
					<Image className="mb-5" source={require("@/assets/mini-logo.png")} />
					<Text className="font-heading text-xl flex-1">Items cadastrados</Text>
				</View>

				<View>
					{featchItems && <CardItemEmpty />}

					{!featchItems && items.length > 0 && (
						<FlatList
							className="gap-2"
							keyExtractor={(item) => item.id}
							data={items}
							renderItem={({ item }) => (
								<View className="flex-row gap-4 items-center mb-2 px-2 py-3 border border-input rounded-md relative">
									<Image
										className="w-14 h-14"
										source={verifyImageUri(item.image)}
									/>
									<View className="gap-1 w-64">
										<View className="flex-row justify-between items-start">
											<Text className="text-base font-heading">
												{item.name}
											</Text>
											<OptionRoot>
												<OptionDelete
													title="Apagar"
													icon={IconOptionDelete.REMOVE}
													onRemove={() => {}}
												/>
											</OptionRoot>
										</View>
										<Text className="text-xs text-wrap text-gray-500">
											{item.description}
										</Text>
									</View>
								</View>
							)}
							showsVerticalScrollIndicator={false}
							style={{ flex: 1 }}
						/>
					)}
					{!featchItems && items.length === 0 && (
						<View className="gap-2 h-[322px] pb-[100px] items-center justify-center">
							<Text className="text-gray-400 text-sm">
								Não existe items cadastrados
							</Text>
						</View>
					)}
				</View>

				<TouchableOpacity
					onPress={handlePresentModalPress}
					className="fixed bottom-10 left-80 bg-violet-600 rounded items-center justify-center p-4 w-10 h-10 shadow-md"
				>
					<Plus size={20} color="#fff" />
				</TouchableOpacity>
			</Container>

			<BottomSheet ref={bottomSheetModalRef}>
				<FormItem items={items} setItems={setItems} />
			</BottomSheet>
		</View>
	);
}
