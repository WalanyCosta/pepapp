import { Button } from "@/components/ui";
import { useDialog } from "@/components/ui/Dialog";
import { View, Image, Text } from "react-native";

type PopoverDualButtonProps = {
	confirm: () => void;
};

export function PopoverDualButton({ confirm }: PopoverDualButtonProps) {
	const { setOpen } = useDialog();

	return (
		<View className="justify-center item-center">
			<Image
				className="self-center w-24 h-24 mb-6"
				source={require("@/assets/logo.png")}
			/>
			<View className="gap-2 justify-center items-center ">
				<Text className="font-heading text-2xl text-center">
					Cancelar pedidos
				</Text>
				<Text className="text-gray-500 text-center w-64 text-base">
					Tem a certeza de que queres cancelar o pedido?
				</Text>
			</View>

			<View className="mt-6 gap-3 justify-center items-center">
				<Button
					className="w-full"
					label="Sim"
					isLoading={false}
					size={"default"}
					variant={"default"}
					onPress={confirm}
				/>

				<Button
					className="w-full"
					label="Não, obrigado"
					isLoading={false}
					size={"default"}
					variant={"ghost"}
					onPress={() => setOpen(false)}
				/>
			</View>
		</View>
	);
}
