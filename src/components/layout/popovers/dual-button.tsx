import { Button } from "@/components/ui";
import { useDialog } from "@/components/ui/Dialog";
import { View, Image, Text } from "react-native";

type PopoverDualButtonProps = {
	title: string;
	question: string;
	confirm: () => void;
};

export function PopoverDualButton({
	confirm,
	title,
	question,
}: PopoverDualButtonProps) {
	const { setOpen } = useDialog();

	return (
		<View className="justify-center item-center">
			<Image
				className="self-center w-36 h-36 mb-6"
				source={require("@/assets/Cancel-red.png")}
			/>
			<View className="gap-2 justify-center items-center ">
				<Text className="font-heading text-2xl text-center">{title}</Text>
				<Text className="text-gray-400 text-center w-72 text-base">
					{question}
				</Text>
			</View>

			<View className="mt-8 gap-3 justify-center items-center">
				<Button
					className="w-full"
					label="Sim"
					isLoading={false}
					size={"lg"}
					variant={"default"}
					onPress={confirm}
				/>

				<Button
					className="w-full"
					label="Não, obrigado"
					isLoading={false}
					size={"lg"}
					variant={"ghost"}
					onPress={() => setOpen(false)}
				/>
			</View>
		</View>
	);
}
