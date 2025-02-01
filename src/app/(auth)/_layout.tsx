import { ItemProvider } from "@/context/item-context";
import { Stack } from "expo-router";

export default function AuthLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="signin"
				options={{
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="reset-password"
				options={{
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="onboarding"
				options={{
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="forgout-password"
				options={{
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
