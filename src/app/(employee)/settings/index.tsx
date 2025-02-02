import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Container } from "@/components/layout";
import { ArrowLeft } from "phosphor-react-native";
import { router } from "expo-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
	Image,
	CaretRight,
	Lock,
	PaintRoller,
	SignOut,
} from "phosphor-react-native";
import { Switch } from "@/components/ui/Switch";
import { useEffect, useState } from "react";
import { useImage } from "@/hooks/use-image";
import { Link } from "expo-router";
import { useError } from "@/hooks/use-error";

export default function Settings() {
	const { user, setAuth } = useAuth();
	const { uploadImage, url, setUrl } = useImage("files");
	const [isEnabled, setIsEnabled] = useState(false);
	const { visible, setVisible, error, setError } = useError();

	async function fetch() {
		const { data, error } = await supabase
			.from("users")
			.select("image")
			.eq("id", user?.id)
			.single();

		if (error) {
			Alert.alert("Error", error.message);
			return;
		}

		if (data && user) {
			setUrl(data.image);
			setAuth({ ...user, image: data.image });
		}
	}

	useEffect(() => {
		fetch();
	}, []);

	async function signOut() {
		setAuth(null);
		await supabase.auth.signOut();
	}

	async function handleUpdateImage() {
		await uploadImage();

		const { data, error } = await supabase
			.from("users")
			.update({ image: url })
			.eq("id", user?.id);

		if (error) {
			setVisible(true);
			setError(null);
			return;
		}
	}

	function handleBack() {
		router.back();
	}

	return (
		<Container visible={visible} setVisible={setVisible} error={error}>
			<TouchableOpacity
				onPress={handleBack}
				className="w-8 h-8 mt-3 mb-5 justify-center items-start"
			>
				<ArrowLeft color="#4B5563" size={28} />
			</TouchableOpacity>

			<View className="gap-3 justify-center items-center">
				<Avatar className="w-28 h-28">
					{url ? (
						<AvatarImage
							source={{
								uri: url,
							}}
						/>
					) : (
						<AvatarFallback textClassname="text-2xl">pq</AvatarFallback>
					)}
				</Avatar>

				<View>
					<Text className="font-heading text-center text-2xl mb-2">
						{user?.name}
					</Text>
					<Text className="text-center text-base text-gray-500">
						{user?.email}
					</Text>
				</View>
			</View>

			<View className="mt-9 gap-3 justify-center ">
				<Text className="text-gray-400 text-sm ml-3">Usuario</Text>
				<View className="border border-input p-6 gap-2 rounded-md">
					<TouchableOpacity
						onPress={handleUpdateImage}
						className="flex-row item-center justify-between border-b border-input py-2"
					>
						<View className="flex-row gap-2 items-center">
							<Image color="#4B5563" size={24} />
							<Text className="text-base text-gray-600">Alterar imagem</Text>
						</View>

						<CaretRight color="#4B5563" size={18} />
					</TouchableOpacity>

					<Link href="/(auth)/reset-password">
						<View className="w-full flex-row item-center justify-between border-b border-input py-2">
							<View className="flex-row gap-2 items-center">
								<Lock color="#4B5563" size={24} />
								<Text className="text-base text-gray-600">Alterar senha</Text>
							</View>

							<CaretRight color="#4B5563" size={18} />
						</View>
					</Link>
					<View className="flex-row item-center justify-between">
						<View className="flex-row gap-2 items-center">
							<PaintRoller color="#4B5563" size={24} />
							<Text className="text-base text-gray-600">
								Alterar tema (light/dark)
							</Text>
						</View>

						<Switch onValueChange={setIsEnabled} value={isEnabled} />
					</View>
				</View>

				<TouchableOpacity
					onPress={signOut}
					className="flex-row item-center justify-between mt-12 py-3 border border-input rounded-md"
				>
					<View className="flex-row gap-2 items-center ml-5">
						<SignOut color="#4B5563" size={24} />
						<Text className="text-base text-gray-600">Logout</Text>
					</View>
				</TouchableOpacity>
			</View>
		</Container>
	);
}
