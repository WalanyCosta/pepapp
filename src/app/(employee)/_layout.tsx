import { ItemProvider } from "@/context/item-context";
import { Stack } from "expo-router";

export default function TabLayout() {
	return (
		<ItemProvider>
			<Stack>
				<Stack.Screen
					name="home/index"
					options={{
						headerShown: false,
					}}
				/>

				<Stack.Screen
					name="order/index"
					options={{
						headerShown: false,
					}}
				/>

				<Stack.Screen
					name="schedule/index"
					options={{
						headerShown: false,
					}}
				/>

				<Stack.Screen
					name="settings/index"
					options={{
						headerShown: false,
					}}
				/>
			</Stack>
		</ItemProvider>
	);
}
