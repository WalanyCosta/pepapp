import { Container } from "@/components/layout";
import { Header } from "@/components/layout/header";
import { OptionDelete, OptionRoot } from "@/components/layout/options/Option";
import { Tab, TabScreen } from "@/components/layout/tab";
import { OptionViewSchedule } from "@/components/screen/schedules/option-view";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { useImage } from "@/hooks/use-image";
import { BagSimple, Clock } from "phosphor-react-native";
import { useState } from "react";
import { View, Text } from "react-native";

export default function Dasboard() {
	const { url, setUrl } = useImage("files");
	const [isActiveTab, setIsActiveTab] = useState("Gauge");

	return (
		<Container>
			<Header url={url} />

			<View className="flex-row items-center gap-2 mb-5">
				<View className="w-64 bg-white border border-input gap-3 px-3 py-4 rounded-md shadow-md items-start">
					<View className="bg-violet-500 px-1 py-1 rounded-md">
						<BagSimple size={16} weight="regular" color="#fff" />
					</View>

					<View className="gap-1">
						<Text className="text-sm text-gray-600 uppercase">
							Pedidos Feitos
						</Text>
						<Text className="text-2xl">1000</Text>
					</View>

					<View className="bg-violet-300 py-2 pl-3 w-full rounded-md">
						<Text className="text-xs">Nesta semana</Text>
					</View>
				</View>

				<View className="w-64 bg-white border border-input gap-3 px-3 py-4 rounded-md shadow-md items-start">
					<View className="bg-violet-500 px-1 py-1 rounded-md">
						<BagSimple size={16} weight="regular" color="#fff" />
					</View>

					<View className="gap-1">
						<Text className="text-sm text-gray-600 uppercase">
							Pedidos Feitos
						</Text>
						<Text className="text-2xl">1000</Text>
					</View>

					<View className="bg-violet-300 py-2 pl-3 w-full rounded-md">
						<Text className="text-xs">Nesta semana</Text>
					</View>
				</View>
			</View>

			<View>
				<Text className="text-gray-400 text-sm ml-3 mb-4">
					Pedidos recentes
				</Text>

				<View className="gap-2">
					<View className="justify-center gap-4 mb-3 p-3 border border-input rounded-md">
						<View className="flex-1 relative">
							<View className="w-full flex-row justify-between items-start">
								<Text className="font-heading text-base mb-2">
									Filipe Argel
								</Text>
								<OptionRoot>
									<OptionDelete
										title="Negar"
										icon="DENIED"
										onRemove={() => {}}
									/>
									<OptionDelete
										title="Aceitar"
										icon="CANCEL"
										onRemove={() => {}}
									/>
								</OptionRoot>
							</View>
							<Text className="text-sm text-gray-400">Items</Text>
						</View>

						<View className="bg-violet-200 rounded-md border-l-2 border-violet-600 flex-row items-center justify-between p-2">
							<View className="flex-row gap-1 items-center">
								<Clock color="#4B5563" size={16} />
								<Text className="text-sm text-gray-600">12:30</Text>
							</View>

							<Badge text={"AGUARDANDO"} />
						</View>
					</View>

					<View className="justify-center gap-4 mb-3 p-3 border border-input rounded-md">
						<View className="flex-1 relative">
							<View className="w-full flex-row justify-between items-start">
								<Text className="font-heading text-base mb-2">
									Filipe Argel
								</Text>
								<OptionRoot>
									<OptionDelete
										title="Negar"
										icon="DENIED"
										onRemove={() => {}}
									/>
									<OptionDelete
										title="Aceitar"
										icon="CANCEL"
										onRemove={() => {}}
									/>
								</OptionRoot>
							</View>
							<Text className="text-sm text-gray-400">Items</Text>
						</View>

						<View className="bg-violet-200 rounded-md border-l-2 border-violet-600 flex-row items-center justify-between p-2">
							<View className="flex-row gap-1 items-center">
								<Clock color="#4B5563" size={16} />
								<Text className="text-sm text-gray-600">12:30</Text>
							</View>

							<Badge text={"AGUARDANDO"} />
						</View>
					</View>

					<View className="justify-center gap-4 mb-3 p-3 border border-input rounded-md">
						<View className="flex-1 relative">
							<View className="w-full flex-row justify-between items-start">
								<Text className="font-heading text-base mb-2">
									Filipe Argel
								</Text>
								<OptionRoot>
									<OptionDelete
										title="Negar"
										icon="DENIED"
										onRemove={() => {}}
									/>
									<OptionDelete
										title="Aceitar"
										icon="CANCEL"
										onRemove={() => {}}
									/>
								</OptionRoot>
							</View>
							<Text className="text-sm text-gray-400">Items</Text>
						</View>

						<View className="bg-violet-200 rounded-md border-l-2 border-violet-600 flex-row items-center justify-between p-2">
							<View className="flex-row gap-1 items-center">
								<Clock color="#4B5563" size={16} />
								<Text className="text-sm text-gray-600">12:30</Text>
							</View>

							<Badge text={"AGUARDANDO"} />
						</View>
					</View>
				</View>
			</View>

			<Tab>
				<TabScreen
					icon="QrCode"
					active={isActiveTab}
					setActive={setIsActiveTab}
					onPress={() => {}}
				/>
				<TabScreen
					icon="UsersThree"
					active={isActiveTab}
					setActive={setIsActiveTab}
					onPress={() => {}}
				/>

				<TabScreen
					icon="Gauge"
					active={isActiveTab}
					setActive={setIsActiveTab}
					onPress={() => {}}
				/>
				<TabScreen
					icon="ClockCounterClockwise"
					active={isActiveTab}
					setActive={setIsActiveTab}
					onPress={() => {}}
				/>

				<TabScreen
					icon="GearSix"
					active={isActiveTab}
					setActive={setIsActiveTab}
					onPress={() => {}}
				/>
			</Tab>
		</Container>
	);
}
