import { ItemProvider } from "@/context/item-context";
import { Stack } from "expo-router";

export default function TabLayout() {
	return (
		<ItemProvider>
			<Stack>
				<Stack.Screen
					name="dashboard/index"
					options={{
						headerShown: false,
					}}
				/>

				<Stack.Screen
					name="items/index"
					options={{
						headerShown: false,
					}}
				/>

				<Stack.Screen
					name="users/index"
					options={{
						headerShown: false,
					}}
				/>

				<Stack.Screen
					name="history/index"
					options={{
						headerShown: false,
					}}
				/>
			</Stack>
		</ItemProvider>
	);
}
