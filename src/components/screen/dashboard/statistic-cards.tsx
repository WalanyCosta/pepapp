import { Icon } from "@/components/layout/icon-component";
import { BagSimple, QrCode, UsersThree } from "phosphor-react-native";
import { Fragment } from "react";
import { View, Text } from "react-native";

type Props = {
	totalOrder: number;
	totalItems: number;
	totalUsers: number;
};

export function StatisticCards({ totalItems, totalOrder, totalUsers }: Props) {
	return (
		<Fragment>
			<View className="w-64 bg-white border border-input gap-3 px-3 py-4 rounded-md shadow-md items-start">
				<View className="bg-red-500 px-1 py-1 rounded-md">
					<BagSimple size={18} weight="regular" color="#fff" />
				</View>

				<View className="gap-1">
					<Text className="text-base text-gray-600 uppercase">
						Pedidos Feitos
					</Text>
					<Text className="text-2xl">{totalOrder}</Text>
				</View>

				<View className="bg-red-300 py-2 pl-3 w-full rounded-md flex-row gap-2 items-center">
					<Icon
						color={totalOrder >= 10 ? "#0d9488" : "#dc2626"}
						size={18}
						name={totalOrder >= 10 ? "TrendUp" : "TrendDown"}
					/>
					<Text className="text-sm"> Nesta semana</Text>
				</View>
			</View>

			<View className="w-64 bg-white border border-input gap-3 px-3 py-4 rounded-md shadow-md items-start">
				<View className="bg-red-500 px-1 py-1 rounded-md">
					<QrCode size={18} weight="regular" color="#fff" />
				</View>

				<View className="gap-1">
					<Text className="text-base text-gray-600 uppercase">
						Itens Cadastros
					</Text>
					<Text className="text-2xl">{totalItems}</Text>
				</View>

				<View className="bg-red-300 py-2 pl-3 w-full rounded-md flex-row gap-2 items-center">
					<Icon color="#0d9488" size={18} name="TrendUp" />
					<Text className="text-sm">Registrados no sistema</Text>
				</View>
			</View>

			<View className="w-64 bg-white border border-input gap-3 px-3 py-4 rounded-md shadow-md items-start">
				<View className="bg-red-500 px-1 py-1 rounded-md">
					<UsersThree size={18} weight="regular" color="#fff" />
				</View>
				<View className="gap-1">
					<Text className="text-base text-gray-600 uppercase">
						Usuários Cadastros
					</Text>
					<Text className="text-2xl">{totalUsers}</Text>
				</View>

				<View className="bg-red-300 py-2 pl-3 w-full rounded-md flex-row gap-2 items-center">
					<Icon color="#0d9488" size={18} name="TrendUp" />
					<Text className="text-sm">Registrados no sistema</Text>
				</View>
			</View>
		</Fragment>
	);
}
