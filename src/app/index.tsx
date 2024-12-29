import { Button } from "@/components/Button";
import { View, Text } from "react-native";

export default function Home() {
	return (
		<View className="text-">
			<Text>Hello react native</Text>
			<Button label="Clique me" variant={"default"} />
		</View>
	);
}
