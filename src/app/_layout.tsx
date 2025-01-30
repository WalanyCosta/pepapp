import "punycode/";
import "@/styles/global.css";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
import { LoadingComponent } from "@/components/layout/loading";
import { Alert } from "react-native";
import { UserRole } from "@/models/user";

export default function RootLayout() {
	const [fontsLoaded, error] = useFonts({
		Inter_600SemiBold,
		Inter_400Regular,
		Inter_500Medium,
	});

	if (!fontsLoaded) {
		return <LoadingComponent />;
	}

	return (
		<AuthProvider>
			<MainLayout />
		</AuthProvider>
	);
}

export function MainLayout() {
	const { setAuth, user: olderUser } = useAuth();

	async function fetchUser(session: any) {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", session.user.id)
			.single();

		if (error) {
			Alert.alert("Error", "Ocorreu um interno. Por favor tente novamente");
			return;
		}

		setAuth({
			...session.user,
			name: data.name,
			image: data.image,
			role: UserRole[data.role as keyof typeof UserRole],
		});

		if (data.role === UserRole.MANAGER) {
			router.replace("/(manager)/dashboard");
		} else {
			router.replace("/(employee)/home");
		}
	}

	useEffect(() => {
		supabase.auth.onAuthStateChange((_event, session) => {
			if (session) {
				fetchUser(session);
				return;
			}
			setAuth(null);
			router.replace("/(auth)");
		});
	}, []);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<StatusBar style="dark" />
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="index" />
				<Stack.Screen name="(auth)/signin" />
				<Stack.Screen name="(auth)/reset-password" />
				<Stack.Screen name="(employee)/home" />
				<Stack.Screen name="(manager)/dashboard" />
			</Stack>
		</GestureHandlerRootView>
	);
}
