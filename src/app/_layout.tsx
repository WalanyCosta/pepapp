import "@/styles/global.css";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import {
	useFonts,
	Inter_600SemiBold,
	Inter_400Regular,
	Inter_500Medium,
} from "@expo-google-fonts/inter";
import { router } from "expo-router";

import { AuthProvider, useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

export default function RootLayout() {
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
		<AuthProvider>
			<MainLayout />
		</AuthProvider>
	);
}

export function MainLayout() {
	const { setAuth } = useAuth();

	useEffect(() => {
		supabase.auth.onAuthStateChange((_event, session) => {
			if (session) {
				setAuth(session.user);
				router.replace("/(employee)/home");
				return;
			}
			setAuth(null);
			router.replace("/");
		});
	}, []);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<StatusBar style="light" />
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="index" />
				<Stack.Screen name="signin" />
				<Stack.Screen name="(employee)/home" />
				<Stack.Screen name="(manager)/home" />
			</Stack>
		</GestureHandlerRootView>
	);
}
