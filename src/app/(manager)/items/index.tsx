import { Container } from "@/components/layout";
import {
	IconOptionAction,
	OptionAction,
	OptionRoot,
} from "@/components/layout/options/Option";
import { Plus } from "phosphor-react-native";
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
import { HeaderBack } from "@/components/layout/header-back";
import { useError } from "@/hooks/use-error";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { NetworkingError } from "@/components/layout/networking-error";
import { RefreshControl } from "react-native-gesture-handler";

export default function Items() {
	const [featchItems, setFeatchItems] = useState(false);
	const [items, setItems] = useState<Item[]>([]);
	const { visible, setVisible, error, setError } = useError();
	const [itemId, setItemId] = useState<string | null>(null);
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const bottomSheetModalEditRef = useRef<BottomSheetModal>(null);
	const isOnline = useOnlineStatus();
	const [reload, setReload] = useState(false);

	const fetchItems = async () => {
		setFeatchItems(true);

		if (!isOnline) {
			setError({
				code: "INFO",
				title: "Ligue a sua internet",
			});
			setVisible(true);
			setFeatchItems(false);
			return;
		}

		const { data, error } = await supabase.from("items").select("*");

		if (error) {
			setFeatchItems(false);
			Alert.alert("Error do sistema", error.message);
			return;
		}

		setItems(data);
		setFeatchItems(false);
	};
	async function handleDelete(id: string) {
		const { error: errorDelete } = await supabase
			.from("items")
			.delete()
			.eq("id", id);

		if (!isOnline) {
			setError({
				code: "INFO",
				title: "Ligue a sua internet",
			});
			setVisible(true);
			setFeatchItems(false);
			return;
		}

		if (errorDelete) {
			Alert.alert("Error do sistema", errorDelete.message);
		}

		const { data, error } = await supabase.from("items").select("*");

		if (error) {
			Alert.alert("Error do sistema", error.message);
			return;
		}

		setItems(data);
	}

	async function handleEditItem(itemId: string) {
		const userFound = items.find((item) => item.id.toString() === itemId);

		if (!userFound) {
			setVisible(true);
			setError({ code: "INTERNAL_SERVER", title: "Usuario não existe" });
			return;
		}
		setItemId(itemId);
		bottomSheetModalEditRef.current?.present();
	}

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	useEffect(() => {
		fetchItems();
	}, [reload]);

	return (
		<View className="flex-1 relative">
			<Container visible={visible} setVisible={setVisible} error={error}>
				<HeaderBack
					title="Items cadastrados"
					backRoute="/(manager)/dashboard"
				/>

				<View className="h-[74vh]">
					{featchItems && <CardItemEmpty />}

					{!featchItems && items.length > 0 && (
						<FlatList
							className="flex-1"
							keyExtractor={(item) => item.id}
							data={items}
							refreshControl={
								<RefreshControl
									refreshing={featchItems}
									onRefresh={() => fetchItems()}
								/>
							}
							renderItem={({ item }) => (
								<View className="flex-row gap-4 justify-center items-center mb-2 px-3 py-5 border border-input rounded-md relative">
									<Image
										className="w-16 h-16"
										source={verifyImageUri(item.image)}
									/>
									<View className="gap-1 w-80">
										<View className="flex-row justify-between">
											<Text className="text-xl font-heading">{item.name}</Text>
											<OptionRoot>
												<OptionAction
													title="Remover"
													icon={IconOptionAction.REMOVE}
													onAction={() => handleDelete(item.id)}
												/>
												<OptionAction
													title="Editar"
													icon={IconOptionAction.EDIT}
													onAction={() => {
														handleEditItem(item.id);
													}}
												/>
											</OptionRoot>
										</View>
										<Text className="text-base text-wrap  text-gray-500">
											{item.description}
										</Text>
									</View>
								</View>
							)}
							contentContainerClassName="pb-40"
							showsVerticalScrollIndicator={false}
						/>
					)}
					{!featchItems && isOnline && items.length === 0 && (
						<View className="gap-2 h-[322px] pb-[100px] items-center justify-center">
							<Text className="text-gray-400 text-sm">
								Não existe items cadastrados
							</Text>
						</View>
					)}

					{!featchItems && !isOnline && items.length === 0 && (
						<NetworkingError setReload={setReload} reload={reload} />
					)}
				</View>

				<TouchableOpacity
					onPress={handlePresentModalPress}
					className="fixed left-[80%] bottom-12 bg-primary rounded items-center justify-center p-4 w-16 h-16 shadow-md"
				>
					<Plus size={20} color="#fff" />
				</TouchableOpacity>
			</Container>

			<BottomSheet snapPoints={["65%"]} ref={bottomSheetModalRef}>
				<FormItem
					itemId={null}
					bottomSheetModalRef={bottomSheetModalRef}
					items={items}
					setItems={setItems}
				/>
			</BottomSheet>

			<BottomSheet snapPoints={["65%"]} ref={bottomSheetModalEditRef}>
				<FormItem
					itemId={itemId}
					bottomSheetModalRef={bottomSheetModalEditRef}
					items={items}
					setItems={setItems}
				/>
			</BottomSheet>
		</View>
	);
}
