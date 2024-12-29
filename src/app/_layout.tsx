import "@/styles/global.css";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
	useFonts,
	Inter_600SemiBold,
	Inter_400Regular,
	Inter_500Medium,
} from "@expo-google-fonts/inter";

// Import your global CSS file

export default function Layout() {
	const [fontsLoaded, error] = useFonts({
		Inter_600SemiBold,
		Inter_400Regular,
		Inter_500Medium,
	});

	useEffect(() => {
		if (fontsLoaded || error) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, error]);

	if (!fontsLoaded && !error) {
		return null;
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<StatusBar style="light" />
			<Slot />
		</GestureHandlerRootView>
	);
}
