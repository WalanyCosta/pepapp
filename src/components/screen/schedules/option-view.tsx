import { OptionView } from "@/components/layout/options/Option";
import { View, Text, Image } from "react-native";

export function OptionViewSchedule() {
	return (
		<OptionView>
			<View className="w-72 gap-3">
				<View>
					<Text className="font-heading text-base mb-2">Detalhes</Text>
					<View className="bg-yellow-50 w-24 p-1 flex-row justify-center rounded-md border border-yellow-500">
						<Text className="text-xs text-yellow-500 text-center">
							Aguardando
						</Text>
					</View>
				</View>

				<View className="mt-3 gap-3 justify-center">
					<View className="gap-1 justify-center">
						<Text className="text-xs font-heading">Descrisão de tamanho</Text>
						<Text className="text-xs text-gray-500">O meu tamanho é xl</Text>
					</View>
					<View className="gap-1 justify-center">
						<Text className="text-xs font-heading">Motivos da solicitação</Text>
						<Text className="text-xs text-gray-500">
							Uniforme que recebe veio com um tamanho menor
						</Text>
					</View>
				</View>

				<View className="mt-3 gap-3 justify-center">
					<View className="gap-3 justify-center">
						<Text className="text-xs font-heading">Items solicitados</Text>

						<View className="gap-2 justify-center mb-3">
							<View className="flex-row items-center gap-3">
								<Image
									className="w-14 h-14"
									source={require("@/assets/fotos-uniformes.jpg")}
								/>

								<View className="gap-1 w-64 pb-2">
									<Text className="text-xs font-heading">T-shirt padrão</Text>
									<Text className="text-xs text-wrap">
										Lorem ipsum dolor sit amet consectetur adipisicing elit
									</Text>
								</View>
							</View>

							<View className="h-px px-2 bg-gray-300" />

							<View className="flex-row items-center gap-3">
								<Image
									className="w-14 h-14"
									source={require("@/assets/fotos-uniformes.jpg")}
								/>

								<View className="gap-1 w-64 pb-2">
									<Text className="text-xs font-heading">T-shirt padrão</Text>
									<Text className="text-xs text-wrap">
										Lorem ipsum dolor sit amet consectetur adipisicing elit
									</Text>
								</View>
							</View>
						</View>
					</View>
				</View>
			</View>
		</OptionView>
	);
}
