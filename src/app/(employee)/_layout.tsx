import { Tabs } from "expo-router";

export default function TabLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name="home/home"
				options={{
					headerShown: false,
				}}
			/>

			<Tabs.Screen
				name="order/index"
				options={{
					headerShown: false,
				}}
			/>

			<Tabs.Screen
				name="schedule/index"
				options={{
					headerShown: false,
				}}
			/>

			<Tabs.Screen
				name="settings/index"
				options={{
					headerShown: false,
				}}
			/>
		</Tabs>
	);
}
