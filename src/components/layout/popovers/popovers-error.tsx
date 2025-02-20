import { type ImageSourcePropType, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Modal, Image } from "react-native";
import { Text } from "react-native";
import { useItem } from "@/context/item-context";
import { Button } from "@/components/ui";

export type StatusCode = "UNAUTHORIZED" | "INFO" | "INTERNAL_SERVER";

export type StatusCodeProps = { code: StatusCode; source: ImageSourcePropType };

const statusCodes: StatusCodeProps[] = [
	{
		code: "UNAUTHORIZED",
		source: require("@/assets/unauthorized-error-red.png"),
	},
	{
		code: "INFO",
		source: require("@/assets/info-red.png"),
	},
	{
		code: "INTERNAL_SERVER",
		source: require("@/assets/internal-server-error-red.png"),
	},
];

type Props = {
	title?: string;
	visible: boolean;
	setVisible: (visible: boolean) => void;
	statusCode?: StatusCode;
};

export function PopoversError({
	title = "Ocorreu um erro interno. Por favor tente novamente",
	visible,
	setVisible,
	statusCode = "INTERNAL_SERVER",
}: Props) {
	const { clearItems } = useItem();

	function getRequire(statusCode: StatusCode) {
		return statusCodes.find((u) => u.code === statusCode)?.source;
	}
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
							<Image
								className="self-center w-36 h-36 mb-6"
								source={getRequire(statusCode)}
							/>
							<View className="gap-2 justify-center items-center ">
								<Text className="font-heading text-2xl text-center">
									{title}
								</Text>
								{statusCode !== "INFO" && (
									<Text className="text-gray-400 text-center w-72 text-base">
										Por favor tente novamente
									</Text>
								)}
							</View>

							<View className="mt-8 gap-3 justify-center items-center">
								<Button
									className="w-full"
									label="Ok"
									isLoading={false}
									size={"lg"}
									variant={"default"}
									onPress={() => setVisible(false)}
								/>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		</Modal>
	);
}
