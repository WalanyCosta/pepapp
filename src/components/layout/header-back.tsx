import { router, type Href } from "expo-router";
import { ArrowLeft } from "phosphor-react-native";
import { Fragment } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";

type Props = {
	title: string;
	backRoute: Href;
};

export function HeaderBack({ title, backRoute }: Props) {
	return (
		<Fragment>
			<TouchableOpacity
				onPress={() => {
					router.replace(backRoute);
				}}
				className="w-8 h-8 mt-3 mb-5 justify-center items-start"
			>
				<ArrowLeft color="#4B5563" size={28} />
			</TouchableOpacity>

			<View className="justify-center mb-5">
				<Image className="mb-5" source={require("@/assets/mini-logo.png")} />
				<Text className="font-heading text-2xl flex-1">{title}</Text>
			</View>
		</Fragment>
	);
}
