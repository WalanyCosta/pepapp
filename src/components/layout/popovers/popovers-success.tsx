import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Modal } from "react-native";
import LottieView from "lottie-react-native";
import { Text } from "react-native";
import { router } from "expo-router";
import { useItem } from "@/context/item-context";
import { Button } from "@/components/ui";

type Props = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
};

export function PopoversSuccess({ visible, setVisible }: Props) {
	const { clearItems } = useItem();

	return (
		<Modal
			transparent
			animationType="fade"
			visible={visible}
			onRequestClose={() => setVisible(false)}
		>
			<TouchableOpacity
				className="w-full h-full"
				onPress={() => setVisible(false)}
			>
				<View className="flex flex-1 justify-center items-center bg-black/75">
					<TouchableOpacity
						className="border border-border bg-background rounded-lg p-6 shadow-lg"
						activeOpacity={1}
					>
						<View className="justify-center item-center">
							<LottieView
								autoPlay
								loop={false}
								style={{
									width: 144,
									height: 144,
									alignSelf: "center",
									marginBottom: 24,
								}}
								source={require("@/assets/success-lottle.json")}
							/>
							<View className="gap-2 justify-center items-center ">
								<Text className="font-heading text-2xl text-center">
									Pedido feito com sucesso
								</Text>
								<Text className="text-gray-400 text-center w-72 text-base">
									Pressione no botão de ok para fechar a messagem
								</Text>
							</View>

							<View className="mt-8 gap-3 justify-center items-center">
								<Button
									className="w-full"
									label="Ok"
									isLoading={false}
									size={"lg"}
									variant={"default"}
									onPress={() => {
										clearItems();
										router.replace("/(employee)/schedule");
									}}
								/>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		</Modal>
	);
}
