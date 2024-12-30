import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "react-native";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
	const { setAuth } = useAuth();

	async function signOut() {
		await supabase.auth.signOut();
		setAuth(null);
	}

	return (
		<SafeAreaView>
			<Text className="">Hello react native</Text>
			<Button title="signout" onPress={() => signOut()} />
		</SafeAreaView>
	);
}
