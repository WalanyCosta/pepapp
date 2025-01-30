import { Container } from "@/components/layout";
import { CardItemEmpty } from "@/components/layout/card-item-empty";
import { HeaderBack } from "@/components/layout/header-back";
import {
	IconOptionDelete,
	OptionDelete,
	OptionRoot,
} from "@/components/layout/options/Option";
import { FormUsers } from "@/components/screen/users/form-users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { supabase } from "@/lib/supabase";
import { UserStatus, type User } from "@/models/user";
import { convertDateOtherFormat } from "@/utils/convert-date-other-format";
import { formatTime } from "@/utils/format-time";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import {
	ArrowLeft,
	Calendar,
	IdentificationCard,
	MagnifyingGlass,
	Plus,
} from "phosphor-react-native";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { Text, TouchableOpacity, Image, View, TextInput } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function Users() {
	const [users, setUsers] = useState<User[]>([]);
	const searchRef = useRef<TextInput>(null);
	const [query, setQuery] = useState("");
	const [featchUsers, setFeatchUsers] = useState(false);
	const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const fetchUsers = async (query = "") => {
		setFeatchUsers(true);
		let response: any;

		if (query.trim() !== "") {
			response = await supabase
				.from("user_profiles")
				.select("*")
				.neq("status", UserStatus.DESACTIVED)
				.ilike("name", `%${query}%`);
		} else {
			response = await supabase
				.from("user_profiles")
				.select("*")
				.neq("status", UserStatus.DESACTIVED);
		}

		if (response.error) {
			setFeatchUsers(false);
			Alert.alert("Error do sistema", response.error.message);
			return;
		}

		setUsers(response.data);
		setFeatchUsers(false);
	};

	async function handleRemoveUser(userId: string) {
		let response: any;

		response = await supabase
			.from("users")
			.update({ status: UserStatus.DESACTIVED })
			.eq("id", userId);

		if (response.error) {
			Alert.alert("Error do sistema", response.error.message);
			return;
		}

		const usersDiferents = users.filter((user) => user.id !== userId);
		setUsers(usersDiferents);
	}

	useEffect(() => {
		let newTimeoutId: any;

		if (timeoutId) {
			clearTimeout(timeoutId); // Limpa qualquer timeout pendente
		}

		if (query.trim() !== "") {
			newTimeoutId = setTimeout(() => {
				fetchUsers(query);
			}, 500);
		} else {
			fetchUsers();
		}

		return () => {
			if (newTimeoutId) {
				clearTimeout(newTimeoutId);
			}
		};
	}, [query]);

	return (
		<Fragment>
			<Container>
				<HeaderBack
					title="Usuarios Cadastrados"
					backRoute="/(manager)/dashboard"
				/>

				<View className="pl-3 mb-5 border border-input rounded-md bg-white w-full flex-row items-center gap-3">
					<TouchableOpacity
						onPress={() => {
							searchRef.current?.focus();
						}}
					>
						<MagnifyingGlass color="#9ca3af" size={16} />
					</TouchableOpacity>
					<TextInput
						ref={searchRef}
						className="text-sm flex-1 text-nowrap text-gray-400"
						placeholder="Pesquisar"
						onChangeText={setQuery}
					/>
				</View>

				<View className="gap-3 justify-center">
					{featchUsers && <CardItemEmpty />}

					{!featchUsers && users.length > 0 && (
						<FlatList
							className="gap-2"
							keyExtractor={(item) => item.id}
							data={users}
							renderItem={({ item }) => (
								<View className="p-3 border border-input rounded-md">
									<View className="w-full flex-row justify-between items-start mb-4">
										<View className="flex-row items-start gap-3">
											<Avatar className="w-10 h-10">
												{item.image ? (
													<AvatarImage
														className=""
														source={{
															uri: item.image,
														}}
													/>
												) : (
													<AvatarFallback textClassname="text-base">
														pq
													</AvatarFallback>
												)}
											</Avatar>

											<View className="justify-start gap-2">
												<Text className="font-heading text-base">
													{item.name}
												</Text>
												<Text className="text-sm text-gray-400">
													{item.email}
												</Text>
											</View>
										</View>

										<OptionRoot>
											<OptionDelete
												title="remover"
												icon={IconOptionDelete.REMOVE}
												onRemove={() => {
													handleRemoveUser(item.id);
												}}
											/>
										</OptionRoot>
									</View>

									<View className="ml-12 flex-row justify-between items-center">
										<View className="flex-row gap-2 items-center">
											<IdentificationCard color="#6b7280" size={16} />
											<Text className="text-sm text-gray-500 capitalize">
												{item.role}
											</Text>
										</View>

										<View className="flex-row gap-2 items-center">
											<Calendar color="#6b7280" size={16} />
											<Text className="text-sm text-gray-500">
												{convertDateOtherFormat(new Date(item.created_at))}
											</Text>
										</View>
									</View>
								</View>
							)}
							showsVerticalScrollIndicator={false}
							contentContainerClassName="gap-3 justify-start pb-8"
							style={{ flex: 1 }}
						/>
					)}
					{!featchUsers && users.length === 0 && (
						<View className="gap-2 h-[322px] pb-[100px] items-center justify-center">
							<Text className="text-gray-400 text-sm">
								Não existe usuarios cadastrados
							</Text>
						</View>
					)}
				</View>

				<TouchableOpacity
					onPress={handlePresentModalPress}
					className="fixed bottom-2 left-80 bg-violet-600 rounded items-center justify-center p-4 w-10 h-10 shadow-md"
				>
					<Plus size={20} color="#fff" />
				</TouchableOpacity>
			</Container>

			<BottomSheet snapPoints={["65%"]} ref={bottomSheetModalRef}>
				<FormUsers users={users} setUsers={setUsers} />
			</BottomSheet>
		</Fragment>
	);
}
