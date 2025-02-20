import { WifiX } from "phosphor-react-native";
import { Text, View } from "react-native";
import { Button } from "../ui";

type Props = {
	reload: boolean;
	setReload: (reload: boolean) => void;
};

export function NetworkingError({ reload, setReload }: Props) {
	return (
		<View className="gap-2 h-[65vh] pb-[100px] items-center justify-center">
			<WifiX color="#f87171" size={64} />
			<Text className="text-gray-800 text-xl bg-red-400 font-heading">
				Algo deu errado
			</Text>
			<Text className="text-gray-400 text-sm text-center">
				Verifica se sua conexão como internet está bem estabelecida
			</Text>
			<Button
				className="w-full mt-4"
				label="Tente novamente"
				size={"default"}
				variant={"default"}
				onPress={() => setReload(!reload)}
			/>
		</View>
	);
}
