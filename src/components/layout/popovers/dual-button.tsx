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
				className="self-center w-24 h-24 mb-6"
				source={require("@/assets/logo.png")}
			/>
			<View className="gap-2 justify-center items-center ">
				<Text className="font-heading text-2xl text-center">{title}</Text>
				<Text className="text-gray-500 text-center w-72 text-base">
					{question}
				</Text>
			</View>

			<View className="mt-8 gap-3 justify-center items-center">
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
