import { Container } from "@/components/layout";
import { ButtonAdd } from "@/components/layout/button-add";
import { CardItemEmpty } from "@/components/layout/card-item-empty";
import { HeaderBack } from "@/components/layout/header-back";
import { NetworkingError } from "@/components/layout/networking-error";
import {
	IconOptionAction,
	OptionAction,
	OptionRoot,
} from "@/components/layout/options/Option";
import { FormUsers } from "@/components/screen/users/form-users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Checkbox } from "@/components/ui/Checkbox";
import { Search } from "@/components/ui/search";
import { useAuth } from "@/context/auth-context";
import { useError } from "@/hooks/use-error";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { supabase } from "@/lib/supabase";
import { UserStatus, type User } from "@/models/user";
import { convertDateOtherFormat } from "@/utils/convert-date-other-format";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Calendar, IdentificationCard, Plus } from "phosphor-react-native";
import {
	Fragment,
	useCallback,
	useDeferredValue,
	useEffect,
	useRef,
	useState,
} from "react";
import { Text, TouchableOpacity, View, FlatList } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

export default function Users() {
	const { user } = useAuth();
	const [users, setUsers] = useState<User[]>([]);
	const [query, setQuery] = useState("");
	const deferredQuery = useDeferredValue(query);
	const [userId, setUserId] = useState<string | null>(null);
	const [filterStatus, setFilterStatus] = useState<string>(UserStatus.ACTIVED);
	const { visible, setVisible, error, setError } = useError();
	const [featchUsers, setFeatchUsers] = useState(false);
	const isOnline = useOnlineStatus();
	const [reload, setReload] = useState(false);

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const bottomSheetModalEditRef = useRef<BottomSheetModal>(null);

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const fetchUsers = async () => {
		setFeatchUsers(true);

		if (!isOnline) {
			setError({
				code: "INFO",
				title: "Ligue a sua internet",
			});
			setVisible(true);
			setFeatchUsers(false);
			return;
		}

		let response: any;

		if (deferredQuery.trim() !== "") {
			response = await supabase
				.from("user_profiles")
				.select("*")
				.eq("status", filterStatus)
				.neq("id", user?.id)
				.ilike("name", `%${deferredQuery}%`);
		} else {
			response = await supabase
				.from("user_profiles")
				.select("*")
				.neq("id", user?.id)
				.eq("status", filterStatus);
		}

		if (response.error) {
			setFeatchUsers(false);
			setVisible(true);
			setError(null);
			return;
		}

		setUsers(response.data);
		setFeatchUsers(false);
	};

	async function handleRemoveUser(userId: string) {
		if (!isOnline) {
			setError({
				code: "INFO",
				title: "Ligue a sua internet",
			});
			setVisible(true);
			return;
		}

		const response = await supabase
			.from("users")
			.update({ status: UserStatus.DESACTIVED })
			.eq("id", userId);

		if (response.error) {
			setVisible(true);
			setError(null);
			return;
		}

		const usersDiferents = users.filter((user) => user.id !== userId);
		setUsers(usersDiferents);
	}

	async function handleEditUser(userId: string) {
		const userFound = users.find((user) => user.id.toString() === userId);

		if (!userFound) {
			setVisible(true);
			setError({ code: "INTERNAL_SERVER", title: "Usuario não existe" });
			return;
		}
		setUserId(userId);
		bottomSheetModalEditRef.current?.present();
	}

	useEffect(() => {
		fetchUsers();
	}, [deferredQuery, filterStatus, reload]);

	return (
		<Fragment>
			<Container visible={visible} setVisible={setVisible} error={error}>
				<HeaderBack
					title="Usuarios Cadastrados"
					backRoute="/(manager)/dashboard"
				/>

				<Search setQuery={setQuery} query={query}>
					<Checkbox
						name={UserStatus.ACTIVED}
						setFilter={setFilterStatus}
						filter={filterStatus}
						label={UserStatus.ACTIVED}
					/>
					<Checkbox
						name={UserStatus.DESACTIVED}
						setFilter={setFilterStatus}
						filter={filterStatus}
						label={UserStatus.DESACTIVED}
					/>
				</Search>

				<View className="gap-3 justify-center h-[74vh]">
					{featchUsers && <CardItemEmpty />}

					{!featchUsers && users.length > 0 && (
						<FlatList
							className="flex-1"
							keyExtractor={(item) => item.id}
							data={users}
							refreshControl={
								<RefreshControl
									refreshing={featchUsers}
									onRefresh={() => fetchUsers()}
								/>
							}
							renderItem={({ item }) => (
								<View className="p-3 border border-input rounded-md">
									<View className="w-full flex-row justify-between items-start mb-4">
										<View className="flex-row items-start gap-3">
											<Avatar className="w-12 h-12">
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
												<Text className="font-heading text-xl">
													{item.name}
												</Text>
												<Text className="text-base text-gray-400">
													{item.email}
												</Text>
											</View>
										</View>

										<OptionRoot>
											<OptionAction
												title="Remover"
												icon={IconOptionAction.REMOVE}
												onAction={() => {
													handleRemoveUser(item.id);
												}}
											/>
											<OptionAction
												title="Editar"
												icon={IconOptionAction.EDIT}
												onAction={() => {
													handleEditUser(item.id);
												}}
											/>
										</OptionRoot>
									</View>

									<View className="ml-12 flex-row justify-between items-center">
										<View className="flex-row gap-2 items-center">
											<IdentificationCard color="#6b7280" size={20} />
											<Text className="text-sm text-gray-500 capitalize">
												{item.role}
											</Text>
										</View>

										<View className="flex-row gap-2 items-center">
											<Calendar color="#6b7280" size={20} />
											<Text className="text-sm text-gray-500">
												{convertDateOtherFormat(new Date(item.created_at))}
											</Text>
										</View>
									</View>
								</View>
							)}
							showsVerticalScrollIndicator={false}
							contentContainerClassName="gap-3 justify-start pb-8"
						/>
					)}
					{!featchUsers && isOnline && users.length === 0 && (
						<View className="gap-2 h-[322px] pb-[100px] items-center justify-center">
							<Text className="text-gray-400 text-base">
								Não existe usuarios cadastrados
							</Text>
						</View>
					)}

					{!featchUsers && !isOnline && users.length === 0 && (
						<NetworkingError setReload={setReload} reload={reload} />
					)}
				</View>

				<TouchableOpacity
					onPress={handlePresentModalPress}
					className="fixed left-[80%] bottom-24 bg-primary rounded items-center justify-center p-4 w-16 h-16 shadow-md"
				>
					<Plus size={20} color="#fff" />
				</TouchableOpacity>
			</Container>

			<BottomSheet snapPoints={["50%"]} ref={bottomSheetModalRef}>
				<FormUsers
					bottomSheetModalRef={bottomSheetModalRef}
					userId={null}
					filterStatus={filterStatus}
					users={users}
					setUsers={setUsers}
				/>
			</BottomSheet>

			<BottomSheet snapPoints={["50%"]} ref={bottomSheetModalEditRef}>
				<FormUsers
					bottomSheetModalRef={bottomSheetModalEditRef}
					userId={userId}
					filterStatus={filterStatus}
					users={users}
					setUsers={setUsers}
				/>
			</BottomSheet>
		</Fragment>
	);
}
